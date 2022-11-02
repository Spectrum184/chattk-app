import { AuthenticatedGuard } from "@/common/guards/authenticated.guard";
import { LoginGuard } from "@/common/guards/login.guard";
import { CreateUserDto } from "@/dto/auth.dto";
import { UsersService } from "@/users/users.service";
import { WebsocketService } from "@/websocket/websocket.service";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    Ip,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private websocketService: WebsocketService
    ) {}

    @Post("login")
    @HttpCode(200)
    @UseGuards(LoginGuard)
    async login(@Req() req: FastifyRequest, @Ip() ipAddress: string) {
        const session = await this.authService.createSession(
            req.user.id,
            ipAddress,
            req.user.sessionName
        );

        return { id: req.user.id, username: req.user.username, session };
    }

    @Post("signup")
    async createUser(@Body() body: CreateUserDto): Promise<void> {
        return this.usersService.createUser(body);
    }

    @Get("user")
    @UseGuards(AuthenticatedGuard)
    user(@Req() req: FastifyRequest) {
        return {
            id: req.user.id,
            username: req.user.username,
        };
    }

    @Delete("logout")
    @UseGuards(AuthenticatedGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: FastifyRequest): Promise<void> {
        await this.authService.deleteSession(req.user.sessionId);
        this.websocketService.logoutSession(req.user.sessionId);
    }
}
