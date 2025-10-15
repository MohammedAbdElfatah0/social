import { Request, Response } from "express";
import { UserRepository } from './../../DB/models/user/user.repository';
import { success } from "zod";
import { NotFoundException } from "../../utils";

class UserService {
    /**
     * 1-get profile user🚀
     * 2-get profile friend🚀
     * 3-add friend
     * 4-remove friend
     * 5-block friend
     * 6-updata info user
     * 7-update password user
     * 8-update email
     */
    private readonly userRepository = new UserRepository();
    public getProfileUser = async (req: Request, res: Response) => {
        const id = req.user!._id;
        const userExist = await this.userRepository.exist({ _id: id });
        res.status(200).json({
            message: "successfully get profile user",
            success: true,
            data: { user: userExist }
        })
    };
    public getProfileFriend = async (req: Request, res: Response) => {
        const { id } = req.params;
        const friendExist = await this.userRepository.exist({ _id: id });
        if (!friendExist) throw new NotFoundException("not found user or deleted")
        res.status(200).json({
            message: "successfully get profile user",
            success: true,
            data: { userFriend: friendExist }
        })
    };

}


export default new UserService();