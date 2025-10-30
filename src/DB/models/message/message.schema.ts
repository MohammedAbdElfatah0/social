import { Schema } from "mongoose";
import { IMessage } from "../../../utils";

export const messageSchema = new Schema<IMessage>(
    {
        content: {
            type: String,
            required: true
        },
        sender: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        attachment: {
            type: Schema.Types.ObjectId,
            ref: "Attachment",
        },
        reactions: {
            type: Schema.Types.ObjectId,
            ref: "Reaction",
        },
    },
    { timestamps: true })