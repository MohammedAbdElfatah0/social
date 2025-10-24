import { GENDER, REACTION, statusFriend, SYS_ROLE, USER_AGENT } from "../enum";
import { ObjectId } from "mongoose";


export interface IUser {
    _id: ObjectId
    //* details user
    fristName: string;
    lastName: string;
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender: GENDER;
    //*friend details
    friends?: ObjectId[];
    //*blocks friends
    blocks?: ObjectId[];
    //*blockedBy
    blockedBy?: ObjectId[];
    //*sent requests friends
    sentRequests?: ObjectId[];
    //*received requests friends
    receivedRequests?: ObjectId[];

    //*auth
    credentialUpdataAt: Date;
    role: SYS_ROLE;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiryAt?: Date;
    isVerified?: boolean;
    //*email
    pendingEmail?: string;
    //*2FA
    is2Verified?: boolean;
    //*tags
    sentTags?: ObjectId[];
    receivedTags?: ObjectId[];
}

export interface IFriend {
    _id?: ObjectId;
    receiver: ObjectId;
    sender: ObjectId;
    status: statusFriend;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISendEmailOptions {
    to: string;
    subject: string;
    html: string;
}
export interface IAttachment {
    url: string,
    type: string
}
export interface IReaction {
    userId: ObjectId,
    reaction: REACTION
}
export interface IPost {
    _id: ObjectId,
    userId: ObjectId,
    content: string,
    attachment?: IAttachment[],
    reactions?: IReaction[],


}
export interface IComment {
    _id: ObjectId,
    userId: ObjectId,
    postId: ObjectId,
    parentId: ObjectId | null,
    content: string,
    attachment: IAttachment,
    reactions: IReaction[],
    mentions?: ObjectId[]
};
declare module "jsonwebtoken" {
    interface JwtPayload {
        _id: ObjectId;
        role: string;
    }
}

declare module "express" {
    interface Request {
        user?: IUser
    }
}