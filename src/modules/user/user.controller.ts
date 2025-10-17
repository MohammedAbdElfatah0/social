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
userRouter.put("/update-info-user", isValidation(userValidation.updateInfoUser), authMiddleware(), UserService.updateInfoUser);
//endP:user/reset-password
userRouter.put("/reset-password", isValidation(userValidation.resetPassword), authMiddleware(), UserService.resetPassword);
//endP:user/update-email
userRouter.put("/update-email", isValidation(userValidation.editEmail), authMiddleware(), UserService.updateEmail);
//endP:user/confirm-update-email
userRouter.put("/confirm-update-email", isValidation(userValidation.confirmEditEmail), authMiddleware(), UserService.confirmEditEmail);
//endP:user/send-otp-2verify-email
userRouter.put("/send-otp-2verify-email",  authMiddleware(), UserService.sendOtp2verifyEmail);
//endP:user/confirm-2verify-email
userRouter.put("/confirm-2verify-email", isValidation(userValidation.confirm2VerifyEmail), authMiddleware(), UserService.confirm2VerifyEmail);
//endP:user/send-tag
userRouter.put("/send-tag", isValidation(userValidation.sendTag), authMiddleware(), UserService.sendTag);






export default userRouter;