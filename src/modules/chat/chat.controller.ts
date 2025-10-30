import { Router } from "express";
import chatService from "./chat.service";
import { authMiddleware, isValidation } from "../../middleware";
import chatValidation from "./chat.validation";

const chatRouter = Router();

chatRouter.get("/:userId", isValidation(chatValidation.getChatValidation.params), authMiddleware(), chatService.getChat);

export default chatRouter;