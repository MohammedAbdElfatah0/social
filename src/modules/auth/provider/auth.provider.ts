
import { BadRequestException, decryptData, IUser, sendEmail } from "../../../utils";
import { ConfirmAccountDto, ResendOtpDto } from "../auth.dto";

export const authProvider = {

    async CheckOtpProvider(confirmAccountDto: ConfirmAccountDto, user: IUser) {
        // Check if OTP exists
        if (!user.otp || !user.otpExpiryAt) {
            throw new BadRequestException("No OTP found for this user");
        }

        // Check if OTP is valid
        if (decryptData(user.otp) !== confirmAccountDto.otp) {
            throw new BadRequestException("Invalid OTP");
        }

        // Check if OTP is expired
        if (user.otpExpiryAt < new Date()) {
            throw new BadRequestException("OTP has expired");
        }
    },
    async resendOtpProvider(resendOtpDto: ResendOtpDto, user: IUser) {
        // Check if OTP is expired
        if (user.otp && user.otpExpiryAt!.getTime() > Date.now()) {
            const timeDiff = user.otpExpiryAt!.getTime() - new Date().getTime();
            const seconds = Math.floor(timeDiff / 1000);
            await sendEmail({
                to: user.email,
                subject: "OTP",
                html: `<p>Your new OTP is ${user.otp}, it will expire in ${seconds} seconds</p>`
            });
            throw new BadRequestException("OTP has notexpired");
        }
    }
}