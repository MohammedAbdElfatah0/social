import { Request, Response } from "express";
import { BadRequestException, comparePassword, decryptData, generateOTP, generateOtpExpiryAt, hashPassword, NotFoundException, sendEmail, statusFriend } from "../../utils";
import { UserRepository } from './../../DB/models/user/user.repository';
import { UserFactory } from "./factory";
import { checkUserNotBlockProvider, decryptPhone } from "./provider";
import { UserDTO } from "./user.dto";
import { FriendRepository } from "../../DB";
// import { promises } from "stream";


class UserService {
    /**
     * create datebase for request friend
     * !add and remove friend 
     * !block and unblock friend
     * * get spicific all friends 
     */
    private readonly userRepository = new UserRepository();
    private readonly friendRepository = new FriendRepository();
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
    // add  friend to request
    public addFriendRequest = async (req: Request, res: Response) => {
        //get data 2 /> 1 id user sender and id friends form params
        const { id } = req.params;
        const userId = req.user!._id;


        if (userId.toString() === id!.toString()) {
            throw new BadRequestException("You can't send friend request to yourself")
        }
        const userSender = await this.userRepository.findById({ _id: userId });
        const userReceiver = await this.userRepository.findById({ _id: id });
        if (!userSender || !userReceiver) {
            throw new NotFoundException("not found user or deleted");
        }
        //check block 
        checkUserNotBlockProvider(userReceiver, userSender);
        //check user sender and user receiver have sent friend request to each other
        if (userSender.friends?.includes(userReceiver._id) || userReceiver.friends?.includes(userSender._id)) {
            throw new BadRequestException("You have already sent a friend request to this user");
        }
        if (userSender.sentRequests?.includes(userReceiver._id) || userReceiver.receivedRequests?.includes(userSender._id)) {
            throw new BadRequestException("You have already sent a friend request to this user");
        }
        const friendRequest = {
            receiver: userReceiver._id,
            sender: userSender._id,
            status: statusFriend.pending,


        };
        //add user receiver to user sender friend requests
        await Promise.all(
            [
                //add to date base request add freinds
                this.friendRepository.create(friendRequest),

                //add to user sender and receiver 
                //sender
                this.userRepository.update(
                    {
                        _id: userSender._id
                    }, {
                    $push: {
                        sentRequests: id
                    }
                }
                ),
                //receiver
                this.userRepository.update(
                    {
                        _id: userReceiver._id
                    }, {
                    $push: {
                        receivedRequests: userSender._id
                    }
                }
                )

            ]
        );
        //send email to user receiver
        await sendEmail({
            to: userReceiver.email,
            subject: "Friend request",
            html: `<p>${userSender.fullName} sent you a friend request</p>`
        });
        //return success
        return res.status(200).json({
            message: "Friend request sent successfully",
            success: true
        });
    }
    //confrim add friend statusFriend.accepted
    public confirmAddFriend = async (req: Request, res: Response) => {

        const { id } = req.params;
        const userId = req.user!._id;
        console.log({ id, userId });
        const [userReceiverExist, userSenderExist] = await Promise.all([
            this.friendRepository.exist({ receiver: userId }),
            this.friendRepository.exist({ sender: id }),
        ]);
        console.log({ userReceiverExist, userSenderExist })

        if (!userReceiverExist || !userSenderExist) {
            throw new NotFoundException("User not found or deleted");
        }
        if (userReceiverExist.status === statusFriend.accepted || userSenderExist.status === statusFriend.accepted) {
            throw new BadRequestException("Friends request  accepted realy");
        }

        const [userReceiver, userSender] = await Promise.all([
            this.userRepository.findById({ _id: userId }),
            this.userRepository.findById({ _id: id }),

        ]);

        // Check blocking
        checkUserNotBlockProvider(userReceiver!, userSender!);

        // Update status and friend lists
        await Promise.all([
            this.friendRepository.update(
                { _id: userReceiverExist._id },
                { $set: { status: statusFriend.accepted } }
            ),
            this.userRepository.update(
                { _id: userId },//sender
                { $push: { friends: id }, $pull: { receivedRequests: id } }
            ),
            this.userRepository.update(
                { _id: id },//receiver
                { $push: { friends: userId }, $pull: { sentRequests: userId } }
            ),
        ]);

        return res.status(200).json({ message: "Friend request accepted successfully" });

    };

    //remove friend
    public removeFriend = async (req: Request, res: Response) => {

        const { id } = req.params;
        const userId = req.user!._id;

        const [userReceiver, userSender] = await Promise.all([
            this.userRepository.findById({ _id: userId }),
            this.userRepository.findById({ _id: id }),
        ]);

        if (!userReceiver || !userSender) {
            throw new NotFoundException("User not found or deleted");
        }
        //there problem controller state conver it status to rejected 
        //who send request to who?
        console.log({ userId, id });
        const reqFriend = await this.friendRepository.exist({
            $or: [
                {
                    receiver: userReceiver._id,
                    sender: userSender._id,
                    status: { $in: [statusFriend.pending, statusFriend.accepted] }
                },
                {
                    receiver: userSender._id,
                    sender: userReceiver._id,
                    status: { $in: [statusFriend.pending, statusFriend.accepted] }
                },
            ],
        });
        console.log({ reqFriend });

        if (!reqFriend) {
            throw new BadRequestException("Friend request not found");
        }

        if (reqFriend.status === statusFriend.rejected) {
            throw new BadRequestException("Friend already removed or rejected");
        }

        await this.friendRepository.update(
            { _id: reqFriend._id },
            { $set: { status: statusFriend.rejected } }
        );

        if (reqFriend.status === statusFriend.accepted) {
            await Promise.all([
                this.userRepository.update({ _id: userReceiver._id }, { $pull: { friends: id } }),
                this.userRepository.update({ _id: userSender._id }, { $pull: { friends: userId } }),
            ]);
        } else {
            await Promise.all([
                this.userRepository.update({ _id: userReceiver._id }, { $pull: { receivedRequests: id } }),
                this.userRepository.update({ _id: userSender._id }, { $pull: { sentRequests: userId } }),
            ]);
        }

        return res.sendStatus(204);

    };

    //block friend
    public blockFriend = async (req: Request, res: Response) => { }
    //unblock friend
    public unblockFriend = async (req: Request, res: Response) => { }
    //get all friends
    public getAllFriends = async (req: Request, res: Response) => { }
};


export default new UserService();