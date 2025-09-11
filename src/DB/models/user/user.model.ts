import { model } from "mongoose";
import { userSchema } from "./user.shema";
import { IUser } from "../../../utils/commen/interface";

export const User=model<IUser>("User",userSchema);