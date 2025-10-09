import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../../common";



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
    });
    postSchema.virtual("comments",{
        localField:"_id",//post id
        foreignField:"postId",
        ref:"Comment"
    })