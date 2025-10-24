import { Router } from "express";
import CommentService from "./comment.service";
import { authMiddleware } from "../../middleware";

const commentRouter = Router({ mergeParams: true });
commentRouter.post("{/:id}", authMiddleware(), CommentService.create);
commentRouter.get("/:id", authMiddleware(), CommentService.getSpecific);
commentRouter.patch("/:id/update", authMiddleware(), CommentService.updateComment);
commentRouter.patch("/:id/freeze", authMiddleware(), CommentService.freezeComment);
commentRouter.patch("/:id/unfreeze", authMiddleware(), CommentService.unfreezeComment);
commentRouter.patch("/:id", authMiddleware(), CommentService.addReaction);
commentRouter.delete("/:id", authMiddleware(), CommentService.deleteComment);
export { commentRouter };