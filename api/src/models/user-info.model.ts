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
}

export interface UserInfoDoc extends Omit<UserInfo, "id"> {
    _id: string;
}

export const userInfoProjection = {
    id: 1,
    firstName: 1,
    lastName: 1,
    userId: 1,
    phone: 1,
    facebook: 1,
    twitter: 1,
    birthday: 1,
    bio: 1,
    avatar: 1,
    updatedAt: 1,
};
