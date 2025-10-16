import { GENDER } from "../../../utils";

export class UserInfoEntity {
    public fullName!: string;
    public phoneNumber!: string;
    public gender?: GENDER;
}