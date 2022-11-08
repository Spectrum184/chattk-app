import { MONGODB_PROVIDER } from "@/constants";
import { MongoDB } from "@/database/database.interface";
import { UserInfo, UserInfoDoc } from "@/models/user-info.model";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UserInfoRepository {
    constructor(@Inject(MONGODB_PROVIDER) private mongo: MongoDB) {}

    async findById(userId: string) {
        return await this.mongo.userInfo.findOne<UserInfoDoc>({ userId });
    }

    async saveUserInfo({ id, ...info }: UserInfo) {
        await this.mongo.userInfo.insertOne({
            _id: id,
            ...info,
        });
    }

    async updateUserInfo({ id, ...info }: UserInfo) {
        await this.mongo.userInfo.updateOne(
            {
                _id: id,
            },
            {
                $set: info,
            },
            { upsert: true }
        );
    }

    async updateAvatar(avatar: string, userId: string) {
        await this.mongo.userInfo.updateOne(
            {
                userId,
            },
            {
                $set: {
                    avatar,
                },
            },
            { upsert: true }
        );
    }
}
