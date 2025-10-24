import { IFriend } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import friendModel from "./friend.model";

export class FriendRepository extends AbstractRepository<IFriend> {
    constructor() {
        super(friendModel);
    }
}
    

