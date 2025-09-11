import { GENDER, SYS_ROLE, USER_AGENT } from "../enum";


export interface IUser {
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
}

export interface ISendEmailOptions {
    to: string;
    subject: string;
    html: string;
}