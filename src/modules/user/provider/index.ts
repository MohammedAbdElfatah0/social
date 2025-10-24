import { BadRequestException, decryptData, IUser } from "../../../utils";

export const decryptPhone = ( userExist: any) => {
    const decryptedPhone = decryptData(userExist.phoneNumber!);
    const userToShow = {
        ...userExist.toObject(),
        phoneNumber: decryptedPhone,
    };
    return userToShow;
}
export const checkUserNotBlockProvider = (userReceiver: IUser, userSender: IUser) => {
    if (userReceiver.blocks?.includes(userSender._id) || userSender.blocks?.includes(userReceiver._id)) {
        throw new BadRequestException("You can't add friend to this user");
    }
}