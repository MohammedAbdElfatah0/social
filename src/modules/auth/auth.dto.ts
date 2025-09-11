import { GENDER } from "../../utils/commen/enum";

export interface RegisterDto {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender: GENDER;
}
export interface LoginDto{
    email:string;
    password:string;
    isVerified?:boolean;
}
export interface ConfirmAccountDto{
    email:string;
    otp:string;
}
export interface UpdateUserDto extends Partial<RegisterDto>{

}