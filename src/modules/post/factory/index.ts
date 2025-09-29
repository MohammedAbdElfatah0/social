import { IUser } from "../../../utils";
import { PostEntity } from "../entity";
import { CreatePostDto } from "../post.DTO";

export class PostFactorySevices {
    createPost(createPostDto: CreatePostDto, user: IUser) {
        const post = new PostEntity();
        post.userId = user._id;
        post.content = createPostDto.content;
        post.reaction = [];
        post.attachment = [];//TODO
        return post;

    }
}