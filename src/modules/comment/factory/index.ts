import { CreateOrEditCommentDTO } from "../comment.dto";
import { CommentEntity } from "../entity";
import { IUser, IPost, IComment } from './../../../utils/common/interface/index';

export class CommentFactoryService {
    createComment(
        createCommentDTO: CreateOrEditCommentDTO,
        user: IUser,
        post: IPost,
        comment: IComment
    ) {
        const newComment = new CommentEntity();
        newComment.userId = user._id;
        newComment.postId = post?._id || comment.postId;
        newComment.parentId=  comment?._id;
        newComment.content = createCommentDTO.content;
        newComment.reactions = [];



        return newComment;
    }
}