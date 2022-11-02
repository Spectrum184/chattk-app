import { convertMongoObj } from "@/common/helper";
import { userInfoDefaultDto, UserInfoDto } from "@/dto/user-info.dto";
import { UserInfo } from "@/models/user-info.model";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserInfoRepository } from "./user-info.repository";
import { ulid } from "ulid";
import { UsersRepository } from "@/users/users.repository";
import { UserError } from "@/users/users.constants";

@Injectable()
export class UserInfoService {
    constructor(
        @InjectPinoLogger(UserInfoService.name)
        private logger: PinoLogger,
        private userInfoRepository: UserInfoRepository,
        private userRepository: UsersRepository
    ) {}

    async findByUserId(username: string): Promise<UserInfo> {
        const user = await this.userRepository.findOneByName(username);

        if (!user) throw new NotFoundException(UserError.userNotFound);

        const result = await this.userInfoRepository.findById(user._id);

        this.logger.info({
            event: `find_user_id:${user._id}`,
            message: "Result of find user info",
        });

        if (!result) return userInfoDefaultDto;

        return convertMongoObj(result);
    }

    async saveUserInfo({ userId, ...info }: UserInfoDto): Promise<UserInfo> {
        const result = await this.userInfoRepository.findById(userId);
        const updatedAt = new Date();

        if (!result) {
            this.logger.info({
                event: `create_user_info:${userId}`,
                message: "Create user info",
            });
            const id = ulid();
            return await this.userInfoRepository.saveUserInfo({
                id,
                userId,
                ...info,
                updatedAt,
            });
        }

        this.logger.info({
            event: `update_user_info:${userId}`,
            message: "Update user info",
        });
        return await this.userInfoRepository.updateUserInfo({
            id: result._id,
            userId,
            ...info,
            updatedAt,
        });
    }
}
