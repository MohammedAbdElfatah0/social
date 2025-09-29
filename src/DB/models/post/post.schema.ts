import { Schema } from "mongoose";
import { IPost, IReaction } from "../../../utils";
import { REACTION } from "../../../utils/common/enum";

const reactionSchema = new Schema<IReaction>({
    reaction: {
        type: Number,
        enum: REACTION,
        default: REACTION.like,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

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
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })