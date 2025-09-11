import express from "express";
import AuthService from "./auth.service";
const authRouter = express.Router();
authRouter.post("/register", AuthService.register);
authRouter.post("/login", AuthService.login);
authRouter.post("/confirm-account", AuthService.confirmAccount);
export default authRouter;