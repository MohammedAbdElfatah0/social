import { SYS_ROLE, hashPassword, generateOTP, generateOtpExpiryAt } from "../../../utils";
import { ConfirmAccountDto, RegisterDto } from "../auth.dto";
import { ConfirmAccountEntity, RegisterEntity } from "../entity";

export class AuthFactoryService {
    constructor() { }
    async register(registerDto: RegisterDto) {
        const user = new RegisterEntity();
        user.fullName = registerDto.fullName as string;
        user.email = registerDto.email;
        user.password = await hashPassword(registerDto.password);
        user.phoneNumber = registerDto.phoneNumber as string;//encrypt 
        user.gender = registerDto.gender;
        user.role = SYS_ROLE.user;
        user.otp = generateOTP();
        user.otpExpiryAt = generateOtpExpiryAt(24 * 60);//1day
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
}


