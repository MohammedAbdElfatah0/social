import { UnAuthorizedException } from "../../../utils";

export
    async function checkUserExistWritePost(postExist: any, req: any) {
    if (![
        postExist.userId.toString(),
    ]
        .includes(req.user!._id.toString())) throw new UnAuthorizedException("you are not authorized to update this post");
    //update post from DB
}