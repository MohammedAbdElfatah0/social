import { NotFoundException, UnAuthorizedException } from "../..";
import { CommentRepository, PostRepository } from "../../../DB";
import { ReactionDTO } from "../../../modules/post/post.DTO";
import { IComment, IPost } from "../interface";

export const addReactionProvider = async (repo: CommentRepository | PostRepository, reaction: ReactionDTO) => {
    const itemExist = await repo.exist({ _id: reaction.id });
    if (!itemExist)
        throw new NotFoundException("Post not found");
   if(itemExist.isFreeze) throw new UnAuthorizedException("pls make it unfreeze first");
    //check reaction is exist
    let reactionIndex = itemExist.reactions!.findIndex((reactions) => reactions.userId.toString() === reaction.userId);
    if (reactionIndex == -1) {
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
                $pull: { reactions: itemExist.reactions?.[reactionIndex] }
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


