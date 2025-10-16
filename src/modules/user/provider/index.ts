import { decryptData } from "../../../utils";

export const decryptPhone = ( userExist: any) => {
    const decryptedPhone = decryptData(userExist.phoneNumber!);
    const userToShow = {
        ...userExist.toObject(),
        phoneNumber: decryptedPhone,
    };
    return userToShow;
}