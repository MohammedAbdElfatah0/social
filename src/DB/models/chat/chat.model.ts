import { model } from "mongoose";
import { chatSchema } from "./chat.schema";

export const chatModel = model("Chat", chatSchema);