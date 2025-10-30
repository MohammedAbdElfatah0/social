import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketAuthMiddleware } from "./middleware";
import { sendMessage } from "./chat";
export const initServer = (server: HttpServer) => {

    const connectedUser = new Map<string, string>();
    console.log("socket io");
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    //auth middleware for checking user authentication
    io.use(SocketAuthMiddleware);
    console.log("socket io" );
    io.on("connection", (socket: Socket) => {
        connectedUser.set(socket.data.user._id.toString(), socket.id);
        console.log({ connectedUser });
        socket.on("sendMessage", sendMessage(socket, io, connectedUser));
    });
}
