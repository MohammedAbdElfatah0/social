import { ObjectId } from "mongoose";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";

export class RegisterEntity {
   public _id!: ObjectId;  
   public fristName!: string;
   public lastName!: string;
   public fullName!: string;
   public email!: string;
   public password!: string;
   public credentialUpdataAt!: Date;
   public phoneNumber!: string;
   public role!: SYS_ROLE;
   public gender!: GENDER;
   public userAgent!: USER_AGENT;
   public otp!: string;
   public otpExpiryAt!: Date;
   public isVerified!: boolean;
}
export class ConfirmAccountEntity {
   public email!: string;
   public otp!: string;
   public otpExpiryAt!: Date |string;
   public isVerified!: boolean;
}
export class ResendOtpEntity {
   public email!: string;
   public otp!: string;
   public otpExpiryAt!: Date |string; 
}
export class ForgetPasswordEntity {
   public email!: string;
   public otp!: string;
   public otpExpiryAt!: Date |string; 
   public password!: string;
   public credentialUpdataAt!: Date;
}