import { Router } from "express";
import CommentService from "./comment.service";
import { authMiddleware } from "../../middleware";

const commentRouter = Router({ mergeParams: true });
commentRouter.post("{/:id}", authMiddleware(), CommentService.create);
commentRouter.get("/:id", authMiddleware(), CommentService.getSpecific);
export { commentRouter };