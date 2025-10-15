import { Router } from "express";
import { authMiddleware } from './../../middleware';
import UserService from "./user.service";

const userRouter = Router();
//endP:user/id/profile/user
userRouter.get("/:id/profile-user", authMiddleware(), UserService.getProfileFriend)
//endP:user/profile-user
userRouter.get("/profile-user", authMiddleware(), UserService.getProfileUser)




export default userRouter;