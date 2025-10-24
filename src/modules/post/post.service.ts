import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import { addReactionProvider, BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils";
import { PostFactorySevices } from "./factory";
import { CreateOrEditPostDTO, ReactionDTO } from "./post.DTO";
import { checkUserExistWritePost } from "./provider";


class PostService {
    private readonly postRepository = new PostRepository();
    private readonly postFactoryService = new PostFactorySevices();
    public createPost = async (req: Request, res: Response) => {
        //get data
        const createPostDto: CreateOrEditPostDTO = req.body;
        //prepare data for create post
        const post = this.postFactoryService.createPost(createPostDto, req.user!);
        //save post
        const createPost = await this.postRepository.create(post);
        //send response
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            data: { createPost }
        });
    };

    public addReaction = async (req: Request, res: Response) => {
        //get data -> params body req.user
        const reactionDTO: ReactionDTO = { ...req.params, userId: req.user!._id.toString(), ...req.body };
        addReactionProvider(this.postRepository, reactionDTO);
        //sent response 
        return res.sendStatus(204);
    };
    public getSpecific = async (req: Request, res: Response) => {
        //get data
        const { id } = req.params;

        //user is exist
        const postExist = await this.postRepository.getAll({ _id: id }, {}, {
            populate: [
                { path: "userId", select: "fullName fristName lastName " },
                { path: "reactions.userId", select: "fullName fristName lastName " },
                { path: "comments", match: { parentId: null } }
                //TOOD::comment
            ]
        });
        //threw error 
        if (!postExist) throw new NotFoundException("post not found");

        //response
        res.status(200).json({
            message: "done", success: true, data: {
                postExist
            }
        });
    };


    public deletePost = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check post is exist?
        const postExist = await this.postRepository.exist({ _id: id },);
        if (!postExist) throw new NotFoundException("post not found")
        //check are user?
        await checkUserExistWritePost(postExist, req);
        //delete post from DB
        await this.postRepository.delete({ _id: id });

        //response
        res.sendStatus(204);

    };
    //update post /> mean edit content or attachment
    public updatePost = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        const updatePostDto: CreateOrEditPostDTO = req.body;
        //check post is exist?
        const postExist = await this.postRepository.exist({ _id: id },);
        if (!postExist) throw new NotFoundException("post not found")
        console.log(postExist.isFreeze);
        if (postExist.isFreeze) throw new UnAuthorizedException("you are not authorized to update this post")
        //check are user?
        await checkUserExistWritePost(postExist, req);
        //update post from DB
        await this.postRepository.update({ _id: id }, updatePostDto);

        //response
        return res.status(201).json({
            message: "Post updated successfully",
            success: true,
            data: { updatePostDto }
        });
    };
    //freeze post
    public freezePost = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check post is exist?
        const postExist = await this.postRepository.exist({ _id: id },);
        if (postExist?.isFreeze) throw new BadRequestException("post is already frozen")
        if (!postExist) throw new NotFoundException("post not found")
        //check are user?
        await checkUserExistWritePost(postExist, req);
        //update post from DB
        await this.postRepository.update({ _id: id }, { isFreeze: true });

        //response
        return res.status(201).json({
            message: "Post frozen successfully",
            success: true,
            data: { postExist }
        });
    };
    //unfreeze post
    public unfreezePost = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check post is exist?
        const postExist = await this.postRepository.exist({ _id: id },);
        if (!postExist) throw new NotFoundException("post not found")
        if (!postExist.isFreeze) throw new BadRequestException("post is not frozen")
        //check are user?
        await checkUserExistWritePost(postExist, req);
        //update post from DB
        await this.postRepository.update({ _id: id }, { isFreeze: false });

        //response
        return res.status(201).json({
            message: "Post unfrozen successfully",
            success: true,
            data: { postExist }
        });
    };
    
}
export default new PostService();
