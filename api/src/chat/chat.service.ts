import { convertMongoObj } from "@/common/helper";
import { SaveDirectMessageDto } from "@/dto/chat.dto";
import { Chat, ChatType, Message, MessageDoc } from "@/models/chat.model";
import { RelationStatus } from "@/models/user.model";
import { UsersService } from "@/users/users.service";
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { Filter } from "mongodb";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { decodeTime, monotonicFactory } from "ulid";
import { ChatError } from "./chat.constants";
import { ChatRepository } from "./chat.repository";

@Injectable()
export class ChatService {
    private ulid = monotonicFactory();

    constructor(
        private usersService: UsersService,
        private chatRepository: ChatRepository,
        @InjectPinoLogger(ChatService.name)
        private logger: PinoLogger
    ) {}

    async getChatsOfUser(userId: string): Promise<Chat[]> {
        const results = await this.chatRepository.getChatsOfUser(userId);
        return results.map((result) => {
            return convertMongoObj(result);
        });
    }

    async saveDirectMessage(
        authorId: string,
        chatId: string,
        content: string
    ): Promise<SaveDirectMessageDto> {
        const oldTime = Date.now();

        const chat = await this.chatRepository.findChat(chatId);

        if (!chat) {
            this.logger.warn({
                event: `message_direct_create_fail:${chatId},chat_not_exist`,
                msg: `User ${authorId} attempted to save message in a non-existent chat.`,
            });
            throw new NotFoundException(ChatError.chatNotFound);
        }
        if (chat.chatType !== ChatType.Direct) {
            this.logger.warn({
                event: `message_direct_create_fail:${chatId},not_direct_chat`,
                msg: `User ${authorId} attempted to save direct message in chat ${chatId}, which is not a Direct chat.`,
            });
            throw new ForbiddenException(ChatError.errorMessage);
        }
        if (!chat.recipients.find((recipient) => recipient.id === authorId)) {
            this.logger.warn({
                event: `authz_fail:${authorId},message_direct_create:${chatId}`,
                msg: `User attempted to save direct message in a chat they dont belong to.`,
            });
            throw new ForbiddenException(ChatError.errorMessage);
        }

        const otherUserId = chat.recipients.find(
            (recipient) => recipient.id !== authorId
        )?.id;
        if (!otherUserId) {
            this.logger.error({
                event: `message_direct_create_fail:${chatId},no_other_user`,
                msg: "No other user found in chat, only the authors id exists.",
            });

            throw new InternalServerErrorException(ChatError.internalServer);
        }
        // NOTE: maybe dont fetch the entire relations array? instead only return the status from mongo? not sure if this a good optimizations or is needed.
        const userRelations = await this.usersService.findRelationsOfUser(
            authorId
        );
        const otherUserRelation = userRelations.find(
            (user) => user.id === otherUserId
        )?.status;
        if (!otherUserRelation || otherUserRelation !== RelationStatus.Friend) {
            this.logger.warn({
                event: `message_direct_create_fail:${chatId},not_friends`,
                msg: `User attempted to save message in a chat they belong to but aren't friends with the recipient user.`,
            });
            throw new ForbiddenException(ChatError.notFriend);
        }

        const message = {
            _id: this.ulid(),
            chatId,
            authorId,
            content,
        };

        await this.chatRepository.saveMessage(chatId, message);

        this.logger.debug({
            event: `message_direct_created:${chatId}`,
            msg: `Message saved ${message._id}`,
            duration: Date.now() - oldTime,
            message_content: message.content,
        });

        return {
            timestamp: decodeTime(message._id),
            ...convertMongoObj(message),
        };
    }

    async getMessages(
        userId: string,
        chatId: string,
        before?: string,
        after?: string,
        limit: number = 50
    ): Promise<Message[]> {
        const oldTime = Date.now();

        const chat = await this.chatRepository.findChat(chatId);

        if (!chat) {
            this.logger.warn({
                event: `message_get_many_fail:${chatId},chat_not_exist`,
                msg: `User ${userId} attempted to get messages from a non-existent chat.`,
            });
            throw new NotFoundException(ChatError.chatNotFound);
        }
        if (!chat.recipients.find((recipient) => recipient.id === userId)) {
            this.logger.warn({
                event: `authz_fail:${userId},message_get_many:${chatId}`,
                msg: `User attempted to get messages from a chat they dont belong to.`,
            });
            throw new ForbiddenException(ChatError.permissionReadChat);
        }

        const query: Filter<MessageDoc> = { chatId };

        if (before) {
            query._id = { $lt: before };
        } else if (after) {
            query._id = { $gt: after };
        }

        const messages = await this.chatRepository.findMessages(query, limit);

        this.logger.debug({
            event: `message_get_many_success:${chatId},before:${before},after:${after},limit:${limit}`,
            msg: `${messages.length} messages loaded by user ${userId}.`,
            duration: Date.now() - oldTime,
        });
        return messages.map((message) => {
            return {
                timestamp: decodeTime(message._id),
                ...convertMongoObj(message),
            };
        });
    }

    async getMessagesById(ids: string[]): Promise<Message[]> {
        const messages = await this.chatRepository.getMessagesById(ids);
        return messages.map((message) => {
            return {
                timestamp: decodeTime(message._id),
                ...convertMongoObj(message),
            };
        });
    }
}
