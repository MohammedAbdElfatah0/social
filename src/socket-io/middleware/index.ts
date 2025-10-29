import { Socket } from "socket.io";
import { NotFoundException, verifyToken } from "../../utils";
import { UserRepository } from "../../DB";

export const SocketAuthMiddleware = async (socket: Socket, next: Function) => {
    const { token } = socket.handshake.auth;
    if (!token) {
        return next(new Error("Authentication error"));
    }
    try {
        const payload = verifyToken(token);
        const user = await new UserRepository().findById(payload.userId);//find user by id
        if (!user) {
            return next(new NotFoundException("User not found"));
        }
        socket.data.user = user;
        //
        return next();
    } catch (error) {
        return next(error);//emit >> connect_error
    }
};