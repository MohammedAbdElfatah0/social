import { Socket } from "socket.io";
import { NotFoundException, verifyToken } from "../../utils";
import { UserRepository } from "../../DB";

export const SocketAuthMiddleware = async (socket: Socket, next: Function) => {
    console.log(socket.handshake.auth.authorization);

    let token = socket?.handshake?.auth?.authorization;
    console.log("✅✅", token);

    if (typeof token === "string") {
        token = token.trim();
        if (token.startsWith("Bearer ")) token = token.slice(7);
    }

    if (!token) {
        console.log("❌❌ Authentication error");
        return next(new Error("Authentication error"));
    }
    try {
        const payload = verifyToken({ token });
        const userId = (payload as any).userId || (payload as any).id;
        const user = await new UserRepository().findById(userId);//find user by id
        if (!user) {
            return next(new NotFoundException("User not found"));
        }
        socket.data.user = user;
        //
        console.log("✅✅Authentication success");
        return next();
    } catch (error) {
        console.log("❌❌ Authentication error");
        console.log(error);
        return next(error);//emit >> connect_error
    }
};