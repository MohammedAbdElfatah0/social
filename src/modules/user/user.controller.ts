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
userRouter.put("/send-otp-2verify-email", authMiddleware(), UserService.sendOtp2verifyEmail);
//endP:user/confirm-2verify-email
userRouter.put("/confirm-2verify-email", isValidation(userValidation.confirm2VerifyEmail), authMiddleware(), UserService.confirm2VerifyEmail);
//endP:user/send-tag
userRouter.put("/send-tag", isValidation(userValidation.sendTag), authMiddleware(), UserService.sendTag);
//endP:user/:id/add-request-friends
userRouter.post("/:id/add-request-friends", isValidation(userValidation.addFriendRequest), authMiddleware(), UserService.addFriendRequest);
//endP:user/:id/delete-request-friends
userRouter.delete("/:id/delete-request-friends", isValidation(userValidation.deleteFriendRequest), authMiddleware(), UserService.deleteFriendRequest);
//endP:user/:id/confirm-add-friend
userRouter.put("/:id/confirm-add-friend", isValidation(userValidation.confirmAddFriend), authMiddleware(), UserService.confirmAddFriend);
//endP:user/:id/remove-friend
userRouter.delete("/:id/remove-friend", isValidation(userValidation.removeFriend), authMiddleware(), UserService.removeFriend);
//endP:user/:id/block-user
userRouter.put("/:id/block-user", isValidation(userValidation.blockFriend), authMiddleware(), UserService.blockFriend);
//endP:user/:id/unblock-user
userRouter.delete("/:id/unblock-user", isValidation(userValidation.unblockFriend), authMiddleware(), UserService.unblockFriend);
//endP:user/get-all-friends
userRouter.get("/get-all-friends",  authMiddleware(), UserService.getAllFriends);









export default userRouter;