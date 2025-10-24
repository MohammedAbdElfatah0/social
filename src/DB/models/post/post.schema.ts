import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../../common";
import { Comment } from "../comment/comment.model";



export const postSchema = new Schema<IPost>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        // required: function (this: any) {
        //     const count = Array.isArray(this?.attachment) ? this.attachment.length : 0;
        //     return count === 0;
        // },
        trim: true,
    },
    attachment: {
        type: Array,
        default: []
    },
    reactions: [
        reactionSchema
    ],
    isFreeze: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });
postSchema.virtual("comments", {
    localField: "_id",//post id
    foreignField: "postId",
    ref: "Comment"
})
postSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    await Comment.deleteMany({ postId: filter._id });
    next();
});