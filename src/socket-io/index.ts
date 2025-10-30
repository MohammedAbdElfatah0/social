import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketAuthMiddleware } from "./middleware";
import { sendMessage } from "./chat";
export const initServer = (server: HttpServer) => {

    const connectedUser = new Map<string, string>();

    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    //auth middleware for checking user authentication
    io.use(SocketAuthMiddleware);
    io.on("connection", (socket: Socket) => {
        console.log({ connectedUser });
        connectedUser.set(socket.data.user._id, socket.id);
        socket.on("sendMessage", sendMessage(socket, io, connectedUser))
    });
}
