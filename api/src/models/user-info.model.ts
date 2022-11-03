export enum SexEnum {
    Male = "Male",
    Female = "Female",
    Other = "Other",
}
export interface UserInfo {
    id: string;
    firstName: string;
    lastName: string;
    userId: string;
    phone?: string;
    facebook?: string;
    twitter?: string;
    birthday?: Date;
    avatar: string;
    bio?: string;
    updatedAt?: Date;
    isShow: boolean;
}

export interface UserInfoDoc extends Omit<UserInfo, "id"> {
    _id: string;
}
