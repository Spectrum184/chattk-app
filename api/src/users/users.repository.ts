import { MONGODB_PROVIDER } from "@/constants";
import { MongoDB } from "@/database/database.interface";
import { ChatDoc, chatProjection, ChatType } from "@/models/chat.model";
import {
    RelationStatus,
    User,
    UserDoc,
    UserNoProfile,
    UserNoProfileDoc,
    userNoProfileProjection,
    userProjection,
    UserRelation,
    userRelationsProjection,
} from "@/models/user.model";
import { Inject, Injectable } from "@nestjs/common";
import { ulid } from "ulid";

@Injectable()
export class UsersRepository {
    constructor(@Inject(MONGODB_PROVIDER) private mongo: MongoDB) {}

    async findOneByName(username: string) {
        return await this.mongo.users.findOne<UserDoc>({ username });
    }

    async findOneNoProfileByName(username: string) {
        return await this.mongo.users.findOne<UserNoProfileDoc>(
            { username },
            {
                projection: userNoProfileProjection,
                collation: { locale: "en", strength: 2 },
            }
        );
    }

    async findOneById(userId: string) {
        return await this.mongo.users.findOne<UserDoc>(
            {
                _id: userId,
            },
            { projection: userProjection }
        );
    }

    async findOneNoProfileById(userId: string) {
        return await this.mongo.users.findOne<UserNoProfileDoc>(
            { _id: userId },
            { projection: userNoProfileProjection }
        );
    }

    async findRelationsOfUser(id: string) {
        return await this.mongo.users.findOne<{
            profile: { relations: UserRelation[] };
        }>(
            { _id: id },
            {
                projection: userRelationsProjection,
            }
        );
    }

    async findUsers(arrID: string[]) {
        return await this.mongo.users
            .find<{ _id: string; username: string }>(
                {
                    _id: {
                        $in: arrID,
                    },
                },
                { projection: { _id: 1, username: 1 } }
            )
            .toArray();
    }

    async findFriendIds(userId: string) {
        return await this.mongo.users.findOne<UserDoc>(
            { _id: userId },
            { projection: { profile: { relations: 1 } } }
        );
    }

    async updateSendFriendRequestTransaction(
        receiverUser: User,
        sender: UserNoProfile
    ) {
        const session = this.mongo.client.startSession();

        await session
            .withTransaction(async () => {
                await this.mongo.users.updateOne(
                    {
                        _id: receiverUser.id,
                    },
                    {
                        $push: {
                            "profile.relations": {
                                id: sender.id,
                                status: RelationStatus.Incoming,
                            },
                        },
                    },
                    {
                        session,
                    }
                );
                await this.mongo.users.updateOne(
                    {
                        _id: sender.id,
                    },
                    {
                        $push: {
                            "profile.relations": {
                                id: receiverUser.id,
                                status: RelationStatus.Outgoing,
                            },
                        },
                    },
                    {
                        session,
                    }
                );
            })
            .finally(() => {
                session.endSession();
            });
    }

    async updateAcceptFriendRequestTransaction(
        receiverUser: User,
        sender: UserNoProfile
    ) {
        const session = this.mongo.client.startSession();
        let chat: ChatDoc | null;
        try {
            await session.withTransaction(async () => {
                await this.mongo.users.updateOne(
                    {
                        _id: receiverUser.id,
                        "profile.relations.id": sender.id,
                    },
                    {
                        $set: {
                            //@ts-ignore TODO: seems like a bug in mongodb types not sure.
                            "profile.relations.$.status": RelationStatus.Friend,
                        },
                    },
                    { session }
                );
                await this.mongo.users.updateOne(
                    {
                        _id: sender.id,
                        "profile.relations.id": receiverUser.id,
                    },
                    {
                        $set: {
                            //@ts-ignore TODO: seems like a bug in mongodb types not sure.
                            "profile.relations.$.status": RelationStatus.Friend,
                        },
                    },
                    { session }
                );

                chat = await this.mongo.chats.findOne<ChatDoc>(
                    {
                        chatType: ChatType.Direct,
                        "recipients.id": {
                            $all: [receiverUser.id, sender.id],
                        },
                    },
                    { projection: chatProjection, session }
                );

                if (chat) return;

                chat = {
                    _id: ulid(),
                    chatType: ChatType.Direct,
                    recipients: [
                        {
                            id: receiverUser.id,
                        },
                        {
                            id: sender.id,
                        },
                    ],
                };
                await this.mongo.chats.insertOne(chat, {
                    session,
                });
                return;
            });
        } finally {
            await session.endSession();
        }

        // @ts-ignore TODO:it is assigned in the try block.
        return chat;
    }

    async findExistUser(username: string) {
        return await this.mongo.users.findOne<{ _id: string }>(
            { username },
            { projection: { _id: 1 }, collation: { locale: "en", strength: 2 } }
        );
    }

    async saveUser({ id, username, passwordHash, email }: User) {
        return await this.mongo.users.insertOne({
            _id: id,
            username,
            passwordHash,
            email,
        });
    }

    async removeFriendTransaction(
        otherUserId: string,
        userProfile: User,
        message: string,
        type: string,
        wasFriend?: boolean
    ) {
        let chatId: string | undefined;
        const session = this.mongo.client.startSession();
        try {
            await session.withTransaction(async () => {
                await this.mongo.users.updateOne(
                    {
                        _id: userProfile.id,
                    },
                    {
                        $pull: {
                            "profile.relations": {
                                id: otherUserId,
                            },
                        },
                    },
                    { session }
                );
                await this.mongo.users.updateOne(
                    {
                        _id: otherUserId,
                    },
                    {
                        $pull: {
                            "profile.relations": {
                                id: userProfile.id,
                            },
                        },
                    },
                    { session }
                );
                if (wasFriend) {
                    const chat = await this.mongo.chats.findOne<{
                        _id: string;
                    }>(
                        {
                            chatType: ChatType.Direct,
                            "recipients.id": {
                                $all: [otherUserId, userProfile.id],
                            },
                        },
                        { projection: { _id: 1 } }
                    );
                    if (chat) chatId = chat._id;
                }
            });
        } finally {
            await session.endSession();
        }

        return {
            user: {
                id: otherUserId,
            },
            chatId,
            message,
        };
    }
}
