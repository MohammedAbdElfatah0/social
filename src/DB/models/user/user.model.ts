import { model } from "mongoose";
import { userSchema } from "./user.shema";
import { IUser } from "../../../utils";

export const User=model<IUser>("User",userSchema);