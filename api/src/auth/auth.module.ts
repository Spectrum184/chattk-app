import { UsersModule } from "@/users/users.module";
import { WebsocketModule } from "@/websocket/websocket.module";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { BearerStrategy } from "./bearer.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [PassportModule, UsersModule, WebsocketModule],
    providers: [AuthService, LocalStrategy, BearerStrategy, AuthRepository],
    controllers: [AuthController],
})
export class AuthModule {}
