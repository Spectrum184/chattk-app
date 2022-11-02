import { ULID_PATTERN } from "@/constants";
import {
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

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

    @Length(26, 26)
    @Matches(ULID_PATTERN)
    userId: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    facebook?: string;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    twitter?: string;

    @IsOptional()
    birthday?: Date;

    @IsString()
    avatar: string =
        "https://res.cloudinary.com/thanhtk/image/upload/v1666446309/1400173657.kougyou_tiddeee__1022x1024__rk5jlz.jpg";

    @IsOptional()
    @IsString()
    @Length(1, 200)
    bio?: string;
}

export class FindUserInfoParam {
    @IsString()
    @Transform(({ value }: TransformFnParams) =>
        typeof value === "string" ? value?.trim() : value
    )
    @MinLength(1)
    username: string;
}

export const userInfoDefaultDto = {
    id: "",
    lastName: "",
    firstName: "",
    userId: "",
    avatar: "https://res.cloudinary.com/thanhtk/image/upload/v1666446309/1400173657.kougyou_tiddeee__1022x1024__rk5jlz.jpg",
};
