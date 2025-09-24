import { SYS_ROLE, hashPassword, generateOTP, generateOtpExpiryAt, sendEmail, encryptData, decryptData } from "../../../utils";
import { ConfirmAccountDto, ForgetPasswordDto, RegisterDto, ResendOtpDto } from "../auth.dto";
import { ConfirmAccountEntity, ForgetPasswordEntity, RegisterEntity, ResendOtpEntity } from "../entity";

export class AuthFactoryService {
    constructor() { }
    async register(registerDto: RegisterDto) {
        const user = new RegisterEntity();
        user.fullName = registerDto.fullName as string;
        user.email = registerDto.email;
        user.password = await hashPassword(registerDto.password);
        user.phoneNumber = encryptData(registerDto.phoneNumber as string) as string;//encrypt 
        user.gender = registerDto.gender;
        user.role = SYS_ROLE.user;
        user.otp = generateOTP();
        user.otpExpiryAt = generateOtpExpiryAt();//1min
        user.credentialUpdataAt = new Date();
        user.isVerified = false;
        return user;
    }
    async confrimAccount(confirmAccountDto: ConfirmAccountDto) {
        const user = new ConfirmAccountEntity();
        user.isVerified = true;
        user.otp = "";
        user.otpExpiryAt = "";
        return user;
    }
    async resendOtp(resendOtpDto: ResendOtpDto) {
        const user = new ResendOtpEntity();
        user.email = resendOtpDto.email;
        user.otp = generateOTP();
        user.otpExpiryAt = generateOtpExpiryAt();//1min
        await sendEmail({
            to: user.email,
            subject: "New OTP",
            html: `<p>Your new OTP is ${decryptData(user.otp)}</p>`
        });
        return user;
    }
    async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
        const user = new ForgetPasswordEntity();
        user.password = await hashPassword(forgetPasswordDto.password);
        user.otp = '';
        user.otpExpiryAt = '';
        return user;
    }
}


