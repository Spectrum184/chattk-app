import { MONGODB_PROVIDER } from "@/constants";
import { MongoDB } from "@/database/database.interface";
import {
    ChatDoc,
    chatProjection,
    MessageDoc,
    messageProjection,
} from "@/models/chat.model";
import { Inject, Injectable } from "@nestjs/common";
import { Filter } from "mongodb";

@Injectable()
export class ChatRepository {
    constructor(
        @Inject(MONGODB_PROVIDER)
        private mongo: MongoDB
    ) {}

    async getChatsOfUser(userId: string) {
        return await this.mongo.chats
            .find(
                {
                    "recipients.id": userId,
                },
                { projection: chatProjection }
            )
            .toArray();
    }

    async findChat(chatId: string) {
        return await this.mongo.chats.findOne<
            Pick<ChatDoc, "chatType" | "recipients">
        >(
            {
                _id: chatId,
            },
            { projection: { chatType: 1, _id: 0, recipients: 1 } }
        );
    }

    async saveMessage(chatId: string, message: MessageDoc) {
        const session = this.mongo.client.startSession();
        try {
            await session.withTransaction(async () => {
                await this.mongo.messages.insertOne(message, { session });
                await this.mongo.chats.updateOne(
                    { _id: chatId },
                    { $set: { lastMessageId: message._id } },
                    { session }
                );
                return;
            });
        } finally {
            await session.endSession();
        }
    }

    async findMessages(query: Filter<MessageDoc>, limit: number) {
        return await this.mongo.messages
            .find(query, { projection: messageProjection })
            .sort({ _id: -1 })
            .limit(limit)
            .toArray();
    }

    async getMessagesById(ids: string[]) {
        return await this.mongo.messages
            .find({ _id: { $in: ids } }, { projection: messageProjection })
            .toArray();
    }
}
