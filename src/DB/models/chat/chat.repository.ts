import { IChat } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { chatModel } from "./chat.model";

export class ChatRepository extends AbstractRepository<IChat> {
    constructor() {
        super(chatModel);
    }
}