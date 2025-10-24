import { IUser } from "../../../utils";
import { PostEntity } from "../entity";
import { CreateOrEditPostDTO } from "../post.DTO";

export class PostFactorySevices {
    createPost(createPostDto: CreateOrEditPostDTO, user: IUser) {
        const post = new PostEntity();
        post.userId = user._id;
        post.content = createPostDto.content;
        post.reaction = [];
        post.attachment = [];//TODO
        return post;

    }
}