import { ULID_PATTERN } from "@/constants";
import {
    IsBoolean,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export enum SexEnum {
    Male = "male",
    Female = "female",
    Other = "other",
}

export class UserInfoDto {
    @MinLength(1)
    @MaxLength(100)
    @IsString()
    @Transform(({ value }: TransformFnParams) =>
        typeof value === "string" ? value?.trim() : value
    )
    firstName: string;

    @MinLength(1)
    @MaxLength(100)
    @IsString()
    @Transform(({ value }: TransformFnParams) =>
        typeof value === "string" ? value?.trim() : value
    )
    lastName: string;

    @IsOptional()
    @Length(26, 26)
    @Matches(ULID_PATTERN)
    userId: string;

    @IsOptional()
    @IsString()
    @Length(0, 50)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    facebook?: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    twitter?: string;

    @IsOptional()
    birthday?: Date;

    @IsOptional()
    @Matches(
        `^${Object.values(SexEnum)
            .filter((v) => typeof v !== "number")
            .join("|")}$`,
        "i"
    )
    sex: SexEnum;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    address: string;

    @IsString()
    avatar: string =
        "https://res.cloudinary.com/thanhtk/image/upload/v1666446309/1400173657.kougyou_tiddeee__1022x1024__rk5jlz.jpg";

    @IsOptional()
    @IsString()
    @Length(1, 200)
    bio?: string;

    @IsBoolean()
    @Transform(({ value }: TransformFnParams) =>
        typeof value === "string" ? value === "true" : value
    )
    isShow: boolean;
}

export class FindUserInfoParam {
    @IsString()
    @Transform(({ value }: TransformFnParams) =>
        typeof value === "string" ? value?.trim() : value
    )
    @MinLength(1)
    username: string;
}

export const DefaultAvatar =
    "https://res.cloudinary.com/thanhtk/image/upload/v1666446309/1400173657.kougyou_tiddeee__1022x1024__rk5jlz.jpg";

export interface GetUserInfoDto {
    isUpdated: boolean;
    firstName?: string;
    lastName?: string;
    userId?: string;
    phone?: string;
    facebook?: string;
    twitter?: string;
    birthday?: Date;
    avatar: string;
    bio?: string;
    updatedAt?: Date;
    isShow: boolean;
    username: string;
    sex?: string;
    address?: string;
}
