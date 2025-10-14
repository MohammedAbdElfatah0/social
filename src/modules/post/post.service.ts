import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import { NotFoundException, UnAuthorizedException } from "../../utils";
import { PostFactorySevices } from "./factory";
import { CreatePostDTO, ReactionDTO } from "./post.DTO";


class PostService {
    private readonly postRepository = new PostRepository();
    private readonly postFactoryService = new PostFactorySevices();
    public createPost = async (req: Request, res: Response) => {
        //get data
        const createPostDto: CreatePostDTO = req.body;
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
        console.log(reactionDTO)
        //check post is exist
        const postExist = await this.postRepository.exist({ _id: reactionDTO.id });
        console.log(postExist)
        if (!postExist)
            throw new NotFoundException("Post not found");
        //check reaction is exist
        let reactionIndex = postExist.reactions!.findIndex((reaction) => reaction.userId.toString() === reactionDTO.userId);
        if (reactionIndex == -1) {
            console.log("reaction not exist")
            await this.postRepository.update(
                { _id: reactionDTO.id },
                {
                    $push:
                    {
                        reactions:
                        {
                            reaction: reactionDTO.reaction,
                            userId: reactionDTO.userId
                        }
                    }
                });
        }
        else if ([undefined, null, ""].includes(reactionDTO.reaction as any)) {
            this.postRepository.update(
                {
                    _id: reactionDTO.id

                },
                {
                    $pull: { reactions: postExist.reactions?.[reactionIndex] }
                })

        }
        else {
            console.log("reaction  exist")
            await this.postRepository.update(
                { _id: reactionDTO.id, "reactions.userId": reactionDTO.userId },
                {
                    "reactions.$.reaction": reactionDTO.reaction
                });
        }
        //add reaction to post

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
        })
    };


    public deletePost = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check post is exist?
        const postExist = await this.postRepository.exist({ _id: id },);
        if (!postExist) throw new NotFoundException("post not found")
        //check are user?
        if (
            ![
                postExist.userId.toString(),
            ]
                .includes(req.user!._id.toString())) throw new UnAuthorizedException("you are not authorized to delete this post")
        //delete post from DB
        await this.postRepository.delete({ _id: id });

        //response
        res.sendStatus(204);

    };
}
export default new PostService();
