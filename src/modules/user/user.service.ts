import { Request, Response } from "express";
import { UserRepository } from './../../DB/models/user/user.repository';
import { BadRequestException, comparePassword, decryptData, generateOTP, generateOtpExpiryAt, hashPassword, NotFoundException, sendEmail } from "../../utils";
import { UserDTO } from "./user.dto";
import { UserFactory } from "./factory";
import { decryptPhone } from "./provider";


class UserService {
    /**
     * 1-get profile user🚀
     * 2-get profile friend🚀
     * 3-add friend⚪
     * 4-remove friend⚪
     * 5-block friend⚪
     * 6-updata info user🚀
     * 7-update password user🚀
     * 8-update email🚀
     */
    private readonly userRepository = new UserRepository();
    private readonly userFactory = new UserFactory();
    public getProfileUser = async (req: Request, res: Response) => {
        const id = req.user!._id;

        // Get full user document, not just existence
        const userExist = await this.userRepository.findById(id);
        if (!userExist) throw new NotFoundException("not found user or deleted")

        // Decrypt for display only
        const userToShow = decryptPhone(userExist);

        res.status(200).json({
            message: "Successfully fetched user profile",
            success: true,
            data: { user: userToShow },
        });
    };

    public getProfileFriend = async (req: Request, res: Response) => {
        const { id } = req.params;
        const friendExist = await this.userRepository.exist({ _id: id });
        if (!friendExist) throw new NotFoundException("not found user or deleted")

        const userToShow = decryptPhone(friendExist);
        res.status(200).json({
            message: "successfully get profile user",
            success: true,
            data: { userFriend: userToShow }
        })
    };

    public updateInfoUser = async (req: Request, res: Response) => {
        const userDto: UserDTO = req.body;
        if (!userDto.fullName && !userDto.gender && !userDto.phoneNumber)
            throw new BadRequestException("Invalid request")
        // get user
        const userExist = await this.userRepository.findById(req.user!._id);
        if (!userExist) throw new NotFoundException("not found user or deleted")
        // build updated data
        const updatedData = this.userFactory.updateInfoUser(userDto, userExist);
        const [firstName, lastName] = updatedData.fullName.split(" ");
        // update in DB
        await this.userRepository.findByIdAndUpdate(
            userExist._id,
            {
                $set: {
                    fristName: firstName,
                    lastName: lastName,
                    phoneNumber: updatedData.phoneNumber,
                    gender: updatedData.gender
                }
            },
            { new: true }
        );

        // response
        res.sendStatus(204);
    };
    public resetPassword = async (req: Request, res: Response) => {
        //get data -/> oldpassword / newpassword id from req.user
        const { oldPassword, newPassword } = req.body;
        const userExist = await this.userRepository.findById(req.user!._id);
        if (!userExist) throw new NotFoundException("not found user or deleted")
        const isMatch = comparePassword(oldPassword, userExist.password)
        if (!isMatch) throw new BadRequestException("Invalid password")
        //*check user credentialUpdataAt
        const oneHour = 60 * 60 * 1000;
        if (userExist.credentialUpdataAt && (userExist.credentialUpdataAt.getTime() + oneHour > Date.now())) {//1 hour
            throw new BadRequestException("User already updated");
        }
        const hashedPassword = await hashPassword(newPassword)
        await this.userRepository.findByIdAndUpdate(
            userExist._id,
            {
                $set: {
                    password: hashedPassword,
                    credentialUpdataAt: new Date()

                }
            },
            { new: true }
        );
        //todo :hendle token make it expired 
        //todo:send mail to make sure change password
        res.sendStatus(204);
    }
    public updateEmail = async (req: Request, res: Response) => {
        //get data
        const userId = req.user!._id;
        const { email: newEmail } = req.body;
        if (!newEmail) throw new BadRequestException("New email is required.")
        //user exist
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException("not found user or deleted")

        //  email already used by another account
        const existing = await this.userRepository.exist({ email: newEmail });
        if (existing && existing._id.toString() !== userId.toString()) {
            throw new BadRequestException("Email already in use.");
        }

        // Throttle: avoid update spam (e.g., only once per hour)
        const oneHour = 60 * 60 * 1000;
        if (user.credentialUpdataAt && (user.credentialUpdataAt.getTime() + oneHour > Date.now())) {
            throw new BadRequestException("You recently changed credentials. Try later.");
        }

        // 3) Generate OTP and expiry
        const otp = generateOTP();
        const otpExpiryAt = generateOtpExpiryAt(10); // 10 minutes

        // 4) Save pendingEmail + otp (do not overwrite actual email)
        await this.userRepository.findByIdAndUpdate(
            userId,
            {
                $set: {
                    pendingEmail: newEmail,
                    otp,
                    otpExpiryAt,
                }
            },
            { new: true }
        );

        // Send OTP to newEmail (and optionally notify old email)
        // send to new email:
        await sendEmail({
            to: newEmail,
            subject: "Confirm your new email address",
            html: `<p>Your OTP to confirm email change is: <b>${decryptData(otp)}</b></p>`
        });

        // optional: send notification to old email (security alert)
        await sendEmail({
            to: user.email,
            subject: "Email change requested",
            html: `<p>We received a request to change your account email to <b>${newEmail}</b>. If this wasn't you, ignore or contact support.</p>`
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to the new email. Please confirm to complete the update."
        });
    };

    public confirmEditEmail = async (req: Request, res: Response) => {

        const userId = req.user!._id;
        const { otp } = req.body;
        if (!otp) throw new BadRequestException("OTP is required.");

        // find user with matching otp (and pendingEmail)
        const user = await this.userRepository.exist({ _id: userId });
        if (!user) throw new NotFoundException("not found user or deleted")

        // check expiry
        if (!user.otpExpiryAt || user.otpExpiryAt.getTime() < Date.now()) {
            // cleanup expired pending data
            await this.userRepository.findByIdAndUpdate(userId, {
                $unset: { pendingEmail: 1, otp: 1, otpExpiryAt: 1 }
            });
            throw new BadRequestException("OTP expired. Request again.");
        }

        // validate OTP value
        if (decryptData(user.otp!) !== otp) {
            throw new BadRequestException("Invalid OTP.");
        }

        // At this point: pendingEmail exists and OTP valid
        const newEmail = user.pendingEmail;
        if (!newEmail) {
            // unexpected — cleanup
            await this.userRepository.findByIdAndUpdate(userId, { $unset: { otp: 1, otpExpiryAt: 1 } });
            throw new BadRequestException("No pending email to confirm.");
        }

        // Final security check: ensure newEmail not used by another account (race condition)
        const existing = await this.userRepository.exist({ email: newEmail });
        if (existing && existing._id.toString() !== userId.toString()) {
            // somebody registered that email meanwhile
            await this.userRepository.findByIdAndUpdate(userId, { $unset: { pendingEmail: 1, otp: 1, otpExpiryAt: 1 } });
            throw new BadRequestException("Email now in use. Choose another.");
        }

        // Apply final update: change email, clear pending fields, set isVerified = true, update credentialUpdataAt
        await this.userRepository.findByIdAndUpdate(userId, {
            $unset: {
                pendingEmail: 1,
                otp: 1,
                otpExpiryAt: 1,
            },
            $set: {
                email: newEmail,
                credentialUpdataAt: new Date()
            }
        });

        // Optional: notify both emails
        await sendEmail({ to: newEmail, subject: "Email changed", html: "<p>Your email was successfully updated.</p>" });

        return res.status(200).json({ success: true, message: "Email successfully updated." });

    };

    public sendOtp2verifyEmail = async (req: Request, res: Response) => {
        //get data token from req.user
        const userId = req.user!._id;
        //check is2Verified 
        //get user from db  
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException("not found user or deleted")
        console.log(user)
        console.log(user.is2Verified)
        if (user.is2Verified) throw new BadRequestException("User already verified")

        //generate otp and expiry time 
        const otp = generateOTP();
        const otpExpiryAt = generateOtpExpiryAt(10);
        //save otp and expiry time in db
        await this.userRepository.findByIdAndUpdate(userId, {
            $set: {
                otp,
                otpExpiryAt
            }
        });
        //send otp to user email
        await sendEmail({
            to: user.email,
            subject: "2 verify email",
            html: `
             <h2>2 verify email</h2>
             <p>Hello,</p>
             <p> Please use the code below to confirm your email:</p>
             <h3 style="color:blue;">${decryptData(otp)}</h3>
         `
        });
        //return success
        return res.status(200).json({
            success: true,
            message: "OTP sent to the email. Please confirm to verify email."
        });


    };
    public confirm2VerifyEmail = async (req: Request, res: Response) => {
        //get email,otp from req.body 
        const { otp } = req.body;
        //check otp and expiry time
        const user = await this.userRepository.findById(req.user!._id);
        if (!user) throw new NotFoundException("not found user or deleted")
        if (!user.otp || !user.otpExpiryAt || user.otpExpiryAt.getTime() < Date.now()) {
            throw new BadRequestException("OTP expired. Request again.");
        }
        // console.log({ userOtp: user.otp, otp });
        if (decryptData(user.otp) !== otp) {
            throw new BadRequestException("Invalid OTP.");
        }
        //get user from db
        await this.userRepository.findByIdAndUpdate(req.user!._id, {
            $unset: {
                otp: 1,
                otpExpiryAt: 1,
            },
            $set: {
                is2Verified: true,
                credentialUpdataAt: new Date()
            }
        });
        //return success
        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });
    };
    public sendTag = async (req: Request, res: Response) => {

        const senderId = req.user!._id;
        const { idSendTag } = req.body;


        const sender = await this.userRepository.findById(senderId);
        const receiver = await this.userRepository.findById(idSendTag);

        if (!sender || !receiver) {
            throw new NotFoundException("not found user or deleted")
        }

        //con't same user send tag to same user
        if (senderId.toString() === idSendTag.toString()) {
            throw new BadRequestException("You can't send tag to yourself")
        }
        //check user have sent tag to this user
        const idSendTagStr = idSendTag.toString();
        const senderIdStr = senderId.toString();
        if (
            sender.sentTags?.some((id) => id.toString() === idSendTagStr) ||
            receiver.receivedTags?.some((id) => id.toString() === senderIdStr)
        ) {
            throw new BadRequestException("You have already sent a tag to this user")
        }


        await this.userRepository.update(
            { _id: senderId },
            { $push: { sentTags: idSendTag } }
        );

        await this.userRepository.update(
            { _id: idSendTag },
            { $push: { receivedTags: senderId } }
        );
        sendEmail({
            to: receiver.email,
            subject: "Tag sent",
            html: `<p>${sender.fullName} sent you a tag</p>`
        });

        return res.status(200).json({
            message: "Tag sent successfully",
            success: true
        });

    };
};


export default new UserService();