import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class PostEntity {
    public _id!:ObjectId;
    public userId!: ObjectId;
    public content!: string;
    public reaction?: IReaction[];
    public attachment?:IAttachment[];
}