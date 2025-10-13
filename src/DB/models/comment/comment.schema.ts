import { Schema } from "mongoose";
import { IComment } from "../../../utils";
import { string } from "zod";
import { reactionSchema } from "../../common";

export const commentSchema = new Schema<IComment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        parentId:
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",

        }
        ,
        content: {
            type: String,
        },
        reactions: [reactionSchema],
        //todo :: attachment

    }
    , {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

commentSchema.virtual('replies', {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentId",
});