import { CLDModule } from "@/common/cloudinary/cloudinary.module";
import { UsersModule } from "@/users/users.module";
import { Module } from "@nestjs/common";
import { UserInfoController } from "./user-info.controller";
import { UserInfoRepository } from "./user-info.repository";
import { UserInfoService } from "./user-info.service";

@Module({
    controllers: [UserInfoController],
    providers: [UserInfoService, UserInfoRepository],
    exports: [UserInfoService],
    imports: [UsersModule, CLDModule],
})
export class UserInfoModule {}
