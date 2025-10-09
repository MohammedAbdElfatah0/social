import { CreateCommentDTO } from "../comment.dto";
import { CommentEntity } from "../entity";
import { IUser, IPost, IComment } from './../../../utils/common/interface/index';

export class CommentFactoryService {
    createComment(
        createCommentDTO: CreateCommentDTO,
        user: IUser,
        post: IPost,
        comment?: IComment
    ) {
        const newComment = new CommentEntity();
        newComment.userId = user._id;
        newComment.postId = post._id;
        newComment.parentIds = comment ? [...comment.parentIds, comment._id] : [];//TODO
        newComment.content = createCommentDTO.content;
        newComment.reactions = [];



        return newComment;
    }
}