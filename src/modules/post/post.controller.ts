import { Router } from "express";
import PostService from "./post.service";
import { authMiddleware } from "../../middleware";

const postRouter = Router();
postRouter.post("/create-post",authMiddleware(), PostService.createPost);
export default postRouter;
