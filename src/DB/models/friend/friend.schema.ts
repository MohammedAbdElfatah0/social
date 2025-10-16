import { Schema } from "mongoose";
import { IFriend, statusFriend } from "../../../utils";

export const friendSchema = new Schema<IFriend>({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Number,
        enum: statusFriend
    }
}, {
    timestamps: true
});
