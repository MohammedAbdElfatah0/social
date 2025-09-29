import express from "express";
import AuthService from "./auth.service";
import { isValidation, authMiddleware } from "../../middleware";
import * as authValidation from "./auth.validation";
const authRouter = express.Router();

authRouter.post("/register", isValidation(authValidation.registerSchema), AuthService.register);
authRouter.post("/login",isValidation(authValidation.loginSchema), AuthService.login);
authRouter.post("/confirm-account",isValidation(authValidation.confirmAccountSchema), AuthService.confirmAccount);
authRouter.post("/resend-otp",isValidation(authValidation.resendOtpSchema), AuthService.resendOtp);
authRouter.post("/forget-password",isValidation(authValidation.forgetPasswordSchema), AuthService.forgetPassword);
authRouter.post("/logout",authMiddleware(),isValidation(authValidation.logoutSchema), AuthService.logout);

export default authRouter;