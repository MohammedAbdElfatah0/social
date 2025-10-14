import { NotFoundException } from "../..";
import { CommentRepository, PostRepository } from "../../../DB";
import { ReactionDTO } from "../../../modules/post/post.DTO";
import { IComment, IPost } from "../interface";

export const addReactionProvider = async (repo: CommentRepository | PostRepository, reaction: ReactionDTO) => {
    const postExist = await repo.exist({ _id: reaction.id });
    console.log(postExist)
    if (!postExist)
        throw new NotFoundException("Post not found");
    //check reaction is exist
    let reactionIndex = postExist.reactions!.findIndex((reactions) => reactions.userId.toString() === reaction.userId);
    if (reactionIndex == -1) {
        console.log("reaction not exist")
        await repo.update(
            { _id: reaction.id },
            {
                $push:
                {
                    reactions:
                    {
                        reaction: reaction.reaction,
                        userId: reaction.userId
                    }
                }
            });
    }
    else if ([undefined, null, ""].includes(reaction.reaction as any)) {
        repo.update(
            {
                _id: reaction.id

            },
            {
                $pull: { reactions: postExist.reactions?.[reactionIndex] }
            })

    }
    else {
        console.log("reaction  exist")
        await repo.update(
            { _id: reaction.id, "reactions.userId": reaction.userId },
            {
                "reactions.$.reaction": reaction.reaction
            });
    }
};


