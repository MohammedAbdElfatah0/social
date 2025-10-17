import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import { ObjectId } from "mongoose";


export interface IUser {
    _id: ObjectId
    fristName: string;
    lastName: string;
    fullName?: string;
    email: string;
    password: string;
    credentialUpdataAt: Date;
    phoneNumber?: string;
    role: SYS_ROLE;
    gender: GENDER;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiryAt?: Date;
    isVerified?: boolean;
    pendingEmail?: string;
    is2Verified?: boolean;
    sentTags?: ObjectId[];
    receivedTags?: ObjectId[];
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
    parentId: ObjectId| null,
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