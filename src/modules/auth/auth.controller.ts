import express from "express";
import AuthService from "./auth.service";
import { isValidation } from "../../middleware/auth.middleware";
import * as authValidation from "./auth.validation";
const authRouter = express.Router();
authRouter.post("/register", isValidation(authValidation.registerSchema), AuthService.register);
authRouter.post("/login", AuthService.login);
authRouter.post("/confirm-account", AuthService.confirmAccount);
export default authRouter;