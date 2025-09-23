import { UserRepository } from "../../../DB";
import { BadRequestException, IUser, NotFoundException } from "../../../utils";
import { ConfirmAccountDto } from "../auth.dto";

export const authProvider = {

    async CheckOtp(confirmAccountDto: ConfirmAccountDto, user:IUser) {
        
        //check otp is valid
        if (user.otp !== confirmAccountDto.otp) {
            throw new BadRequestException("Invalid otp");
        }
        //check otpExpire is valid
        if (user.otpExpiryAt! < new Date()) {
            throw new BadRequestException("Otp expired");
        }
    }
}