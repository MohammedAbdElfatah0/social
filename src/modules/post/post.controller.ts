import { Router } from "express";
import PostService from "./post.service";
import { authMiddleware } from "../../middleware";
import {commentRouter} from "../comment/comment.controller";

const postRouter = Router();
postRouter.use("/:postId/comment",commentRouter)
postRouter.post("/create-post", authMiddleware(), PostService.createPost);
postRouter.patch("/:id", authMiddleware(), PostService.addReaction);
postRouter.get("/:id", PostService.getSpecific);
export default postRouter;
