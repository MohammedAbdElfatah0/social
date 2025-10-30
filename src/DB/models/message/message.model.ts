import { model } from "mongoose";
import { messageSchema } from "./message.schema";

export const messageModel = model("Message", messageSchema);