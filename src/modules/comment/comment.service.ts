import { Request, Response } from "express";
import { PostRepository } from './../../DB/models/post/post.repository';
import { IComment, NotFoundException } from "../../utils";
import { CommentRepository } from './../../DB/models/comment/comment.repository';
import { CommentFactoryService } from './factory/index';
import { CreateCommentDTO } from './comment.dto';

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
        const postExist = await this.PostRepository.exist({ _id: postId });
        if (!postExist) {
            throw new NotFoundException("Not Found post");
        }
        //check comment exist and replay comment
        let commentExist: IComment | any = undefined;
        if (id) {
            commentExist = await this.CommentRepository.exist({ _id: id });
            if (!commentExist) throw new NotFoundException("Not  Found Comment");
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
}


export default new CommentService();