import { AuthenticatedGuard } from "@/common/guards/authenticated.guard";
import { UlidValidatorPipe } from "@/common/pipes/ulid-validator.pipe";
import { FindUserInfoParam, UserInfoDto } from "@/dto/user-info.dto";
import { UserInfo } from "@/models/user-info.model";
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UserInfoService } from "./user-info.service";
import { FastifyRequest } from "fastify";

@UseGuards(AuthenticatedGuard)
@Controller("user-info")
export class UserInfoController {
    constructor(private userInfoService: UserInfoService) {}

    @Get(":username")
    async getInfoUser(@Param() params: FindUserInfoParam): Promise<UserInfo> {
        return await this.userInfoService.findByUserId(params.username);
    }

    @Post()
    async saveUserInfo(@Body() body: UserInfoDto, @Req() req: FastifyRequest) {
        return await this.userInfoService.saveUserInfo({
            ...body,
            userId: req.user.id,
        });
    }
}
