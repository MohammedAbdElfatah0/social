import { Router } from "express";
import PostService from "./post.service";
import { authMiddleware, isValidation } from "../../middleware";
import { commentRouter } from "../comment/comment.controller";
import postValidation from "./post.validation";
//todo validtion
const postRouter = Router();
postRouter.use("/:postId/comment", commentRouter)
postRouter.post("/create-post", isValidation(postValidation.createPostBody), authMiddleware(), PostService.createPost);
postRouter.patch("/:id",isValidation(postValidation.addReaction.params), authMiddleware(), PostService.addReaction);
postRouter.get("/:id",isValidation(postValidation.getSpecific.params),isValidation(postValidation.getSpecific.query), authMiddleware(), PostService.getSpecific);
postRouter.delete("/:id",isValidation(postValidation.deletePost.params), authMiddleware(), PostService.deletePost);
postRouter.put("/:id",isValidation(postValidation.updatePost.params),isValidation(postValidation.updatePost.body), authMiddleware(), PostService.updatePost);
postRouter.put("/:id/freeze",isValidation(postValidation.freezePost.params), authMiddleware(), PostService.freezePost);
postRouter.put("/:id/unfreeze",isValidation(postValidation.unfreezePost.params), authMiddleware(), PostService.unfreezePost);
// postRouter.delete("/:id/hard-delete", authMiddleware(), PostService.hardDeletePost);
export default postRouter;
