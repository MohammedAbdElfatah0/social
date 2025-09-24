import { z } from "zod";
import { ConfirmAccountDto, ForgetPasswordDto, LoginDto, RegisterDto, ResendOtpDto } from "./auth.dto";
import { GENDER } from "../../utils";



export const registerSchema = z.strictObject<RegisterDto>({

    fullName: z.string().min(2).max(20) as unknown as string,
    email: z.email() as unknown as string,
    password: z.string().min(6).max(20) as unknown as string,
    phoneNumber: z.string().min(11).max(11) as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER,
});

export const loginSchema = z.strictObject<LoginDto>({
    email: z.email() as unknown as string,
    password: z.string().min(6).max(20) as unknown as string,
});

export const confirmAccountSchema = z.strictObject<ConfirmAccountDto>({
    email: z.email() as unknown as string,
    otp: z.string().min(5).max(5) as unknown as string,
});

export const resendOtpSchema = z.strictObject<ResendOtpDto>({
    email: z.email() as unknown as string,
});

export const forgetPasswordSchema = z.strictObject<ForgetPasswordDto>({
    email: z.email() as unknown as string,
    otp: z.string().min(5).max(5) as unknown as string,
    password: z.string().min(6).max(20) as unknown as string,
    confirmPassword: z.string().min(6).max(20) as unknown as string,
});




