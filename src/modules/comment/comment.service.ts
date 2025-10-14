import { Request, Response } from "express";
import { PostRepository } from './../../DB/models/post/post.repository';
import { IComment, IPost, NotFoundException, UnAuthorizedException } from "../../utils";
import { CommentRepository } from './../../DB/models/comment/comment.repository';
import { CommentFactoryService } from './factory/index';
import { CreateCommentDTO } from './comment.dto';
import { includes, success } from "zod";

class CommentService {
    private readonly PostRepository = new PostRepository();
    private readonly CommentRepository = new CommentRepository();
    private readonly CommentFactoryService = new CommentFactoryService();


    public create = async (req: Request, res: Response) => {
        //get data from param 
        const { postId, id } = req.params;
        console.log({ postId, id, user: req.user?._id });
        const createCommentDTO: CreateCommentDTO = req.body;
        //check post exist
        let postExist = await this.PostRepository.exist({ _id: postId });

        //check comment exist and replay comment
        let commentExist: IComment | any = undefined;
        if (id) {
            commentExist = await this.CommentRepository.exist({ _id: id });
            if (!commentExist) throw new NotFoundException("Not  Found Comment");
            console.log(commentExist)
            if (!postExist) {

                //null or undefund
                postExist = await this.PostRepository.exist({ _id: commentExist.postId });
            }
        }
        if (!postExist) {
            throw new NotFoundException("Not Found post");
        }
        //prepare data for comment>>> factory
        const comment = this.CommentFactoryService.createComment(
            createCommentDTO,
            req.user!,
            postExist,
            commentExist!
        );
        const createComment = await this.CommentRepository.create(comment);
        //send response 
        res.status(201).json({
            message: "comment created successfully",
            success: true,
            data: { createComment }
        })
    };
    public getSpecific = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check comment 
        const commentExist = await this.CommentRepository.exist({ _id: id }, {}, { populate: [{ path: "replies" }] });
        if (!commentExist) throw new NotFoundException("Not Found Comment")
        //response 
        res.status(200).json({
            message: "comment fetch successfully",
            success: true,
            data: { commentExist }
        })
    };

    public deleteComment = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check comment is exist?
        const commentExist = await this.CommentRepository.exist({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }]
        });
        if (!commentExist) throw new NotFoundException("comment not found")
        //check are user?
        if (
            ![
                commentExist.userId.toString(),
                (commentExist.postId as unknown as IPost).userId.toString()
            ]
                .includes(req.user!._id.toString())) throw new UnAuthorizedException("you are not authorized to delete this comment")
        //delete comment from DB
        await this.CommentRepository.delete({ _id: id });

        //response
        res.sendStatus(204);

    };
}


export default new CommentService();