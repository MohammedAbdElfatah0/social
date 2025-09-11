import { IUser } from "../../../utils/commen/interface";
import { AbstractRepository } from "../../abstract.repository";
import { User } from "./user.model";

 export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User);
    }
    async getSpecificUser(){
        return await this.model.find();
    }
}
