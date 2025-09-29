import { GENDER } from "../../utils";

export interface RegisterDto {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender: GENDER;
}
export interface LoginDto {
    email: string;
    password: string;
    isVerified?: boolean;
}
export interface ConfirmAccountDto {
    email: string;
    otp: string ;
}
export interface ResendOtpDto {
    email: string;
    otp?:string;//not required
}
export interface ForgetPasswordDto {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
    credentialUpdataAt: Date;
}
export interface LogoutDto {
    Headers:{
        authorization:string,
        refreshToken:string
    }
}
