import { PostRepository } from "../../../DB";
import { authMiddlewareGraphql, isValidationGraph } from "../../../middleware";
import { decryptData } from "../../../utils";
import { postValidation } from "./post-graphql.schema.vaildation";

export const getSpecificPost = async (parent: any, args: any, context: any) => {
    await authMiddlewareGraphql(context);
    await isValidationGraph(postValidation, args)
    const postRepo = new PostRepository();
    const post = await postRepo.getOne({ _id: args.id }, {}, { populate: [{ path: "userId", select: "fullName fristName lastName email phoneNumber" }] })

    if (!post) {
        throw new Error("Post not found")
    }
    const isPopulatedUser = (u: unknown): u is { phoneNumber?: string } => !!u && typeof u === "object" && "phoneNumber" in (u as any);
    if (isPopulatedUser(post.userId) && post.userId.phoneNumber) {
        post.userId.phoneNumber = decryptData(post.userId.phoneNumber);
    }
    return { message: "post found", success: true, post };
}