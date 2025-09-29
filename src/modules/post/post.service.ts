import { Request, Response } from "express";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CreatePostDto } from "./post.DTO";
import { PostFactorySevices } from "./factory";

class PostService {
    private readonly postRepository = new PostRepository();
    private readonly postFactoryService = new PostFactorySevices();
    public createPost = async (req: Request, res: Response) => {
        //get data
        const createPostDto: CreatePostDto = req.body;
        //prepare data for create post
        const post = this.postFactoryService.createPost(createPostDto, req.user!);
        //save post
      const createPost=  await this.postRepository.create(post);
        //send response
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            data: {createPost}
        });
    }
}
export default new PostService();
