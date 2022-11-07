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
    sex?: string;
    address?: string;
}

export interface UserInfoDoc extends Omit<UserInfo, "id"> {
    _id: string;
}
