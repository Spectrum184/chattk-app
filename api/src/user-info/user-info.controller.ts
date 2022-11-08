import { AuthenticatedGuard } from "@/common/guards/authenticated.guard";
import {
    FindUserInfoParam,
    GetUserInfoDto,
    UserInfoDto,
} from "@/dto/user-info.dto";
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
import { Public } from "@/auth/auth.decorators";

@UseGuards(AuthenticatedGuard)
@Controller("user-info")
export class UserInfoController {
    constructor(private userInfoService: UserInfoService) {}

    @Get(":username")
    async getInfoUser(
        @Param() params: FindUserInfoParam
    ): Promise<GetUserInfoDto> {
        return await this.userInfoService.findByUsername(params.username);
    }

    @Post()
    async saveUserInfo(@Body() body: UserInfoDto, @Req() req: FastifyRequest) {
        return await this.userInfoService.saveUserInfo({
            ...body,
            userId: req.user.id,
        });
    }

    @Post("/avatar")
    async uploadAvatar(@Req() req: FastifyRequest) {
        const data = await req.file();
        const buffer = await data.toBuffer();

        return this.userInfoService.uploadAvatar(buffer, req.user.id);
    }
}
