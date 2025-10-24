import { model } from "mongoose";
import {  requestFriendSchema } from "./friend.schema";

const requestFriendModel = model("RequestFriend", requestFriendSchema);

export default requestFriendModel;