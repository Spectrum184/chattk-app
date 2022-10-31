import { convertMongoObj } from "@/common/helper";
import { userInfoDefaultDto, UserInfoDto } from "@/dto/user-info.dto";
import { UserInfo } from "@/models/user-info.model";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { UserInfoRepository } from "./user-info.repository";
import { ulid } from "ulid";

@Injectable()
export class UserInfoService {
    constructor(
        @InjectPinoLogger(UserInfoService.name)
        private logger: PinoLogger,
        private userInfoRepository: UserInfoRepository
    ) {}

    async findByUserId(userId: string): Promise<UserInfo> {
        const result = await this.userInfoRepository.findById(userId);

        if (!result) return userInfoDefaultDto;

        return convertMongoObj(result);
    }

    async saveUserInfo({ userId, ...info }: UserInfoDto): Promise<UserInfo> {
        const result = await this.userInfoRepository.findById(userId);
        const updatedAt = new Date();

        if (!result) {
            const id = ulid();
            return await this.userInfoRepository.saveUserInfo({
                id,
                userId,
                ...info,
                updatedAt,
            });
        }

        return await this.userInfoRepository.updateUserInfo({
            id: result._id,
            userId,
            ...info,
            updatedAt,
        });
    }
}
