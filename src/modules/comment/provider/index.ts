import { IComment, IPost, UnAuthorizedException } from "../../../utils";

 export function commentWriteByExistUser(commentExist: IComment,req:any) {
            if (![
                commentExist.userId.toString(),
                (commentExist.postId as unknown as IPost).userId.toString()
            ]
                .includes(req.user!._id.toString())) throw new UnAuthorizedException("you are not authorized to update this comment");
        }