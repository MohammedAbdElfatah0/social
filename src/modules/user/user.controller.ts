import { Router } from "express";
import { authMiddleware, isValidation } from './../../middleware';
import UserService from "./user.service";
import userValidation from "./user.validation";

const userRouter = Router();
//endP:user/id/profile/user
userRouter.get("/:id/profile-user", authMiddleware(), UserService.getProfileFriend);
//endP:user/profile-user
userRouter.get("/profile-user", authMiddleware(), UserService.getProfileUser);
//endP:user/update-info-user
userRouter.put("/update-info-user",isValidation(userValidation.updateInfoUser), authMiddleware(), UserService.updateInfoUser);
//endP:user/reset-password
userRouter.put("/reset-password",isValidation(userValidation.resetPassword), authMiddleware(), UserService.resetPassword);




export default userRouter;