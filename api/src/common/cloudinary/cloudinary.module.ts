import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CLDService } from "./cloudinary.services";

@Module({
    exports: [CLDService],
    providers: [CLDService, ConfigService],
})
export class CLDModule {}
