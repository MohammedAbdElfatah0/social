import { IMessage } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { messageModel } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage>{
    constructor(){
        super(messageModel)
    }
}