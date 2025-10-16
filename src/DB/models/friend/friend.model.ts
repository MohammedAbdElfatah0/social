import { model } from "mongoose";
import { friendSchema } from "./friend.schema";

const friendModel = model("Friend", friendSchema);

export default friendModel;