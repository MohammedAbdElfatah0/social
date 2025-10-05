import { Router } from "express";
import PostService from "./post.service";
import { authMiddleware } from "../../middleware";

const postRouter = Router();
postRouter.post("/create-post", authMiddleware(), PostService.createPost);
postRouter.patch("/:id", authMiddleware(), PostService.addReaction);
postRouter.get("/:id", PostService.getSpecific);
export default postRouter;
