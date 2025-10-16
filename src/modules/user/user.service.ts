import { Request, Response } from "express";
import { UserRepository } from './../../DB/models/user/user.repository';
import { success } from "zod";
import { BadRequestException, comparePassword, decryptData, hashPassword, NotFoundException } from "../../utils";
import { UserDTO } from "./user.dto";
import { UserFactory } from "./factory";
import { decryptPhone } from "./provider";
import { compare } from "bcryptjs";

class UserService {
    /**
     * 1-get profile user🚀
     * 2-get profile friend🚀
     * 3-add friend
     * 4-remove friend
     * 5-block friend
     * 6-updata info user🚀
     * 7-update password user
     * 8-update email
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
        if (userExist.credentialUpdataAt.getTime() + oneHour > Date.now()) {//1 hour
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



}


export default new UserService();