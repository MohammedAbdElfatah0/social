import { SYS_ROLE } from "../../../utils/commen/enum";
import { hashPassword } from "../../../utils/hash";
import { generateOTP, generateOtpExpiryAt } from "../../../utils/otp";
import { ConfirmAccountDto, RegisterDto } from "../auth.dto";
import { ConfirmAccountEntity, RegisterEntity } from "../entity";

export  class AuthFactoryService {
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
        return user;
    }
    async confrimAccount(confirmAccountDto:ConfirmAccountDto){
        const user = new ConfirmAccountEntity();
        user.email = confirmAccountDto.email;
        user.otp = '';
        user.isVerified = true;
        // user.otpExpiryAt = undefined;//how send data undefind
        return user;
    }
}


