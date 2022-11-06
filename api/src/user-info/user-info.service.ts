import {
    DefaultAvatar,
    GetUserInfoDto,
    UserInfoDto,
} from "@/dto/user-info.dto";
import { UserInfo } from "@/models/user-info.model";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserInfoRepository } from "./user-info.repository";
import { ulid } from "ulid";
import { UsersRepository } from "@/users/users.repository";
import { UserError } from "@/users/users.constants";
import { ConfigService } from "@nestjs/config";
import { Encryption } from "@/common/encryption";

@Injectable()
export class UserInfoService {
    encryption;
    constructor(
        @InjectPinoLogger(UserInfoService.name)
        private logger: PinoLogger,
        private userInfoRepository: UserInfoRepository,
        private userRepository: UsersRepository,
        private config: ConfigService
    ) {
        this.encryption = new Encryption(
            this.config.get("userInfoEncryptKey") || ""
        );
    }

    async findByUsername(username: string): Promise<GetUserInfoDto> {
        const user = await this.userRepository.findOneByName(username);

        if (!user) throw new NotFoundException(UserError.userNotFound);

        const result = await this.userInfoRepository.findById(user._id);

        this.logger.info({
            event: `find_user_id:${user._id}`,
            message: "Result of find user info",
        });

        if (!result)
            return {
                isUpdated: false,
                username: user.username,
                isShow: true,
                avatar: DefaultAvatar,
            };

        const decryptResult = this.encryptionInfo(
            { ...result, id: result._id },
            "decrypt"
        );

        return {
            username: user.username,
            isUpdated: true,
            ...decryptResult,
        };
    }

    async saveUserInfo({ userId, ...info }: UserInfoDto): Promise<UserInfo> {
        const result = await this.userInfoRepository.findById(userId);
        const updatedAt = new Date();
        let newInfo;

        if (!result) {
            this.logger.info({
                event: `create_user_info:${userId}`,
                message: "Create user info",
            });
            const id = ulid();
            newInfo = this.encryptionInfo(
                {
                    id,
                    ...info,
                    updatedAt,
                    userId,
                },
                "encrypt"
            );
            await this.userInfoRepository.saveUserInfo(newInfo);

            return {
                id,
                ...info,
                updatedAt,
                userId,
            };
        }

        this.logger.info({
            event: `update_user_info:${userId}`,
            message: "Update user info",
        });

        newInfo = this.encryptionInfo(
            {
                id: result._id,
                ...info,
                updatedAt,
                userId,
            },
            "encrypt"
        );

        await this.userInfoRepository.updateUserInfo(newInfo);

        return {
            id: result._id,
            ...info,
            updatedAt,
            userId,
        };
    }

    encryptionInfo(userInfo: UserInfo, type: "encrypt" | "decrypt"): UserInfo {
        const newInfo = Object.fromEntries(
            Object.entries(userInfo).filter(([_, v]) => v)
        );
        const keyNotEncrypt = [
            "updatedAt",
            "id",
            "userId",
            "avatar",
            "isShow",
            "_id",
        ];

        for (const key in newInfo) {
            if (Object.prototype.hasOwnProperty.call(newInfo, key)) {
                const data = newInfo[key];
                if (!keyNotEncrypt.includes(key)) {
                    if (type === "decrypt") {
                        newInfo[key] = this.encryption.decrypt(data);
                    } else {
                        newInfo[key] = this.encryption.encrypt(data);
                    }
                }
            }
        }
        return { ...userInfo, ...newInfo };
    }
}
