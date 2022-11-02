import { WebsocketModule } from "@/websocket/websocket.module";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
    imports: [WebsocketModule],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
    controllers: [UsersController],
})
export class UsersModule {}
