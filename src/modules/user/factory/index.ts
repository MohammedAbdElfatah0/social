import { encryptData, IUser } from "../../../utils";
import { UserInfoEntity } from "../entity";
import { UserDTO } from "../user.dto";

export class UserFactory {
    constructor() { }
    updateInfoUser(userDto: UserDTO, userInfo: IUser) {
        const user = new UserInfoEntity();
        user.fullName = userDto?.fullName || userInfo.fullName as string;
        user.phoneNumber =encryptData(userDto?.phoneNumber)  || userInfo.phoneNumber as string;
        user.gender = userDto?.gender || userInfo.gender;
        console.log({user});
        return user;
    }
}