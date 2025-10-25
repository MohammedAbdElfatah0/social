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
        isFreeze: {
            type: Boolean,
            default: false
        },
        freezeAt: Date,

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
// delete all replay
import mongoose from "mongoose";

commentSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    const commentModel = mongoose.model("Comment");

    // نجيب الكومنت نفسه عشان نعرف حالته
    const comment = await commentModel.findOne(filter);

    // لو مش موجود أو مش متجمد، نكمّل عادي
    if (!comment || !comment.isFreeze) {
        return next();
    }

    // cascade delete في الاتجاه الأسفل فقط
    const cascadeDelete = async (parentId: mongoose.Types.ObjectId) => {
        const replies = await commentModel.find({ parentId });
        for (const reply of replies) {
            await cascadeDelete(reply._id); // حذف الأبناء أولًا
            await commentModel.deleteOne({ _id: reply._id }); // ثم الرد نفسه
        }
    };

    await cascadeDelete(comment._id);
    next();
});


commentSchema.pre("deleteMany", { document: false, query: true }, async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    const commentModel = mongoose.model("Comment");
    const comments = await commentModel.find(filter);

    for (const comment of comments) {
        if (comment.isFreeze) {
            const cascadeDelete = async (parentId: mongoose.Types.ObjectId) => {
                const replies = await commentModel.find({ parentId });
                for (const reply of replies) {
                    await cascadeDelete(reply._id);
                    await commentModel.deleteOne({ _id: reply._id });
                }
            };
            await cascadeDelete(comment._id);
        }
    }

    next();
});
