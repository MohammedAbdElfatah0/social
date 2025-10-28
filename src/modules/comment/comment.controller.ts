import { Router } from "express";
import CommentService from "./comment.service";
import { authMiddleware, isValidation } from "../../middleware";
import commentValidation from "./comment.validation";

const commentRouter = Router({ mergeParams: true });
commentRouter.post("{/:id}", isValidation(commentValidation.createComment.params), isValidation(commentValidation.createComment.body), authMiddleware(), CommentService.create);
commentRouter.get("/:id", isValidation(commentValidation.getSpecificComment.params), authMiddleware(), CommentService.getSpecific);
commentRouter.patch("/:id/update", isValidation(commentValidation.updateComment.params), isValidation(commentValidation.updateComment.body), authMiddleware(), CommentService.updateComment);
commentRouter.patch("/:id/freeze", isValidation(commentValidation.freezeComment.params), authMiddleware(), CommentService.freezeComment);
commentRouter.patch("/:id/unfreeze", isValidation(commentValidation.unfreezeComment.params), authMiddleware(), CommentService.unfreezeComment);
commentRouter.patch("/:id", isValidation(commentValidation.addReaction.params),isValidation(commentValidation.addReaction.body), authMiddleware(), CommentService.addReaction);
commentRouter.delete("/:id", isValidation(commentValidation.deleteComment.params), authMiddleware(), CommentService.deleteComment);
export { commentRouter };