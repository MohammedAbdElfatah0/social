import { Request, Response } from "express";
import { addReactionProvider, IComment, IPost, NotFoundException, UnAuthorizedException } from "../../utils";
import { CommentRepository } from './../../DB/models/comment/comment.repository';
import { PostRepository } from './../../DB/models/post/post.repository';
import { CreateOrEditCommentDTO, ReactionDTO } from './comment.dto';
import { CommentFactoryService } from './factory/index';
import { commentWriteByExistUser } from "./provider";

class CommentService {
    private readonly PostRepository = new PostRepository();
    private readonly commentRepository = new CommentRepository();
    private readonly commentFactoryService = new CommentFactoryService();


    public create = async (req: Request, res: Response) => {
        //get data from param 
        const { postId, id } = req.params;
        console.log({ postId, id, user: req.user?._id });
        const createCommentDTO: CreateOrEditCommentDTO = req.body;
        //check post exist
        let postExist = await this.PostRepository.exist({ _id: postId });

        //check comment exist and replay comment
        let commentExist: IComment | any = undefined;
        if (id) {
            commentExist = await this.commentRepository.exist({ _id: id });
            if (!commentExist) throw new NotFoundException("Not  Found Comment");
            if (!postExist) {

                //null or undefund
                postExist = await this.PostRepository.exist({ _id: commentExist.postId });
            }
        }
        if (!postExist) {
            throw new NotFoundException("Not Found post");
        }
        if (postExist.isFreeze) throw new UnAuthorizedException("post is freeze");
        if (commentExist.isFreeze) throw new UnAuthorizedException("comment is freeze");
        //prepare data for comment>>> factory
        const comment = this.commentFactoryService.createComment(
            createCommentDTO,
            req.user!,
            postExist,
            commentExist!
        );
        const createComment = await this.commentRepository.create(comment);
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
        const commentExist = await this.commentRepository.exist({ _id: id }, {}, { populate: [{ path: "replies" }] });
        if (!commentExist) throw new NotFoundException("Not Found Comment")
        //check freeze
        if (commentExist.isFreeze) throw new UnAuthorizedException("comment is freeze");
        //response 
        res.status(200).json({
            message: "comment fetch successfully",
            success: true,
            data: { commentExist }
        })
    };
    public addReaction = async (req: Request, res: Response) => {
        //get data -> params body req.user
        const reactionDTO: ReactionDTO = { ...req.params, userId: req.user!._id.toString(), ...req.body };
        //check comment is exist?
        addReactionProvider(this.commentRepository, reactionDTO);
        //sent response 
        return res.sendStatus(204);
    };
//delete comment hard
    public deleteComment = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check comment is exist?
        const commentExist = await this.commentRepository.exist({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }]
        });
        if (!commentExist) throw new NotFoundException("comment not found")
        //check are user?
        commentWriteByExistUser(commentExist, req);
        //delete comment from DB
        await this.commentRepository.delete({ _id: id });

        //response
        res.sendStatus(204);

    };
    //update comment
    public updateComment = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        const updateCommentDTO: CreateOrEditCommentDTO = req.body;
        //check comment is exist?
        const commentExist = await this.commentRepository.exist({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }]
        });
        if (!commentExist) throw new NotFoundException("comment not found")
        if (commentExist.isFreeze) throw new UnAuthorizedException("comment is freeze");
        //check are user?
        commentWriteByExistUser(commentExist, req);
        //update comment from DB
        await this.commentRepository.update({ _id: id }, updateCommentDTO);

        //response
        res.status(200).json({
            message: "comment updated successfully",
            success: true,
            data: { updateCommentDTO }
        });
    };
    //freeze comment
    public freezeComment = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check comment is exist?
        const commentExist = await this.commentRepository.exist({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }]
        });
        if (!commentExist) throw new NotFoundException("comment not found")
        if (commentExist.isFreeze) throw new UnAuthorizedException("comment is freeze");
        //check are user?
        commentWriteByExistUser(commentExist, req);
        //update comment from DB
        const freezeAt = new Date();
        freezeAt.setHours(freezeAt.getHours() + 24);
        await this.commentRepository.update({ _id: id }, { isFreeze: true ,freezeAt: freezeAt});

        //response
        res.status(200).json({
            message: "comment freeze successfully",
            success: true,
        });
    };
    //unfreeze comment
    public unfreezeComment = async (req: Request, res: Response) => {
        //get data 
        const { id } = req.params;
        //check comment is exist?
        const commentExist = await this.commentRepository.exist({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }]
        });
        if (!commentExist) throw new NotFoundException("comment not found")
        if (!commentExist.isFreeze) throw new UnAuthorizedException("comment is not freeze");
        //check are user?
        commentWriteByExistUser(commentExist, req);
        //update comment from DB
        await this.commentRepository.update({ _id: id }, { isFreeze: false,freezeAt: null });

        //response
        res.status(200).json({
            message: "comment unfreeze successfully",
            success: true,
        });
    };
}


export default new CommentService();