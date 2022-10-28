import { convertMongoObj } from "@/common/helper";
import { CreateUserDto } from "@/dto/auth.dto";
import { OnlineSocketsList } from "@/dto/chat.dto";
import { AddFriendDto, RemoveFriendDto } from "@/dto/user.dto";
import {
    Relation,
    RelationStatus,
    User,
    UserNoProfile,
    UserRelation,
} from "@/models/user.model";
import {
    ConflictException,
    ImATeapotException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { ulid } from "ulid";
import { UserError, UserType } from "./users.constants";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(
        private configService: ConfigService,
        @InjectPinoLogger(UsersService.name)
        private logger: PinoLogger,
        private userRepository: UsersRepository
    ) {}

    async findOneByName(username: string): Promise<User | null> {
        const result = await this.userRepository.findOneByName(username);

        if (!result) return null;

        return convertMongoObj(result);
    }

    async findOneNoProfileByName(
        username: string
    ): Promise<UserNoProfile | null> {
        const result = await this.userRepository.findOneNoProfileByName(
            username
        );
        if (!result) return null;

        return convertMongoObj(result);
    }

    async findOneById(userId: string): Promise<User | null> {
        const result = await this.userRepository.findOneById(userId);
        if (!result) return null;
        return convertMongoObj(result);
    }

    async findOneNoProfileById(userId: string): Promise<UserNoProfile | null> {
        const result = await this.userRepository.findOneNoProfileById(userId);
        if (!result) return null;
        return convertMongoObj(result);
    }

    async findRelationsOfUser(id: string): Promise<UserRelation[]> {
        const userRelations = await this.userRepository.findRelationsOfUser(id);
        return userRelations?.profile?.relations
            ? userRelations.profile.relations
            : [];
    }

    async findRelatedUsersWithStatus(
        userIds: string[],
        sockets: OnlineSocketsList,
        relations: Relation[]
    ) {
        const users = await this.userRepository.findUsers(userIds);

        return users.map(({ _id: id, username }) => {
            /* istanbul ignore next */
            const relationship = relations.find(
                (relation) => relation.id === id
            )?.status;
            const online = sockets.get(id)?.online;
            return {
                id,
                // TODO: return undefined instead of false, check client side code to make sure.
                online: relationship === RelationStatus.Friend ? online : false, // return online status only if users are friends else false.
                username,
                relationship,
            };
        });
    }

    async getFriendIds(userId: string): Promise<string[]> {
        const user = await this.userRepository.findFriendIds(userId);
        if (!user?.profile?.relations || user.profile.relations.length === 0)
            return [];
        return user.profile.relations
            .filter((user) => user.status === RelationStatus.Friend)
            .map((user) => user.id);
    }

    async addFriend(
        receiverUsernameOrId: string,
        sender: UserNoProfile,
        isId: boolean
    ): Promise<AddFriendDto> {
        const receiverUser = isId
            ? await this.findOneById(receiverUsernameOrId)
            : await this.findOneByName(receiverUsernameOrId);

        if (!receiverUser) throw new NotFoundException(UserError.userNotFound);

        if (receiverUser.id === sender.id)
            throw new ConflictException(UserError.addYourself);
        const relationship = receiverUser.profile?.relations?.find(
            (relation) => relation.id === sender.id
        );
        if (relationship) {
            switch (relationship.status) {
                case RelationStatus.Friend:
                    throw new ConflictException(UserError.alreadyFriend);
                case RelationStatus.Incoming:
                    throw new ConflictException(UserError.alreadySentRequest);
                case RelationStatus.BlockedByOther:
                    throw new ConflictException(UserError.blockUser);
                case RelationStatus.Blocked:
                    throw new ConflictException(UserError.blockedUser);
                case RelationStatus.Outgoing: // accepts the friend request
                    const chat =
                        await this.userRepository.updateAcceptFriendRequestTransaction(
                            receiverUser,
                            sender
                        );
                    if (!chat)
                        return {
                            user: {
                                id: receiverUser.id,
                                username: receiverUser.username,
                            },
                            message: UserError.requestAccepted,
                        };
                    return {
                        user: {
                            id: receiverUser.id,
                            username: receiverUser.username,
                        },
                        chat: convertMongoObj(chat),
                        message: UserError.requestAccepted,
                    };
            }
        }

        // sends a friend request
        await this.userRepository.updateSendFriendRequestTransaction(
            receiverUser,
            sender
        );

        return {
            user: {
                id: receiverUser.id,
                username: receiverUser.username,
            },
            message: UserError.requestSent,
        };
    }

    async removeFriend(
        otherUserId: string,
        user: UserNoProfile
    ): Promise<RemoveFriendDto> {
        const userProfile = await this.findOneById(user.id);
        if (!userProfile) throw new NotFoundException(UserError.userNotFound);
        const relationship = userProfile.profile?.relations?.find(
            (relation) => relation.id === otherUserId
        );
        if (!relationship) throw new NotFoundException(UserError.userNotFound);
        let message: string;
        let type: string;

        switch (relationship.status) {
            case RelationStatus.BlockedByOther:
                throw new ConflictException(UserError.blockedUser);
            case RelationStatus.Blocked:
                throw new ConflictException(UserError.blockUser);
            case RelationStatus.Friend:
                message = UserError.friendRemove;
                type = UserType.friendRemove;
                return await this.userRepository.removeFriendTransaction(
                    otherUserId,
                    user,
                    message,
                    type,
                    true
                );
            case RelationStatus.Outgoing:
                message = UserError.cancelRequest;
                type = UserType.cancelRequest;
                return await this.userRepository.removeFriendTransaction(
                    otherUserId,
                    user,
                    type,
                    message
                );
            case RelationStatus.Incoming:
                message = UserError.declinedRequest;
                type = UserType.declinedRequest;
                return await this.userRepository.removeFriendTransaction(
                    otherUserId,
                    user,
                    type,
                    message
                );
            default:
                this.logger.error({
                    event: `user_friend_remove_failed:${otherUserId},${user.id},invalid_relation_status`,
                    msg: `Invalid relation status found in ${otherUserId} user document.`,
                });
                throw new InternalServerErrorException(
                    UserError.internalServer
                );
        }
    }

    async createUser({
        username,
        password,
        email,
    }: CreateUserDto): Promise<void> {
        if (this.configService.get("disableSignup")) {
            this.logger.warn({
                event: `user_create_fail:${username},signup_disabled`,
                msg: `user account creation is disabled.`,
            });
            throw new ImATeapotException(UserError.currentlyOff);
        }
        const userExists = await this.userRepository.findExistUser(username);
        if (userExists) {
            this.logger.warn({
                event: `user_create_fail:${username},user_exists`,
                msg: `User account creation attempted with an existing username.`,
            });
            throw new ConflictException(UserError.conflictUsername);
        }
        const passwordHash = await bcrypt.hash(
            password,
            this.configService.get("bcryptRounds") as number
        );

        const id = ulid();
        await this.userRepository.saveUser({
            id: ulid(),
            username,
            passwordHash,
            email,
        });
        this.logger.info({
            event: `user_created:${id}`,
            msg: `A new user account was created with the username ${username}.`,
        });
    }
}
