import { Router } from "express";
import PostService from "./post.service";
import { authMiddleware } from "../../middleware";
import { commentRouter } from "../comment/comment.controller";
//todo validtion
const postRouter = Router();
postRouter.use("/:postId/comment", commentRouter)
postRouter.post("/create-post", authMiddleware(), PostService.createPost);
postRouter.patch("/:id", authMiddleware(), PostService.addReaction);
postRouter.get("/:id", authMiddleware(), PostService.getSpecific);
postRouter.delete("/:id", authMiddleware(), PostService.deletePost);
postRouter.put("/:id", authMiddleware(), PostService.updatePost);
export default postRouter;
