import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketAuthMiddleware } from "./middleware";
export const initServer = (server: HttpServer) => {


    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    //auth middleware for checking user authentication
    io.use(SocketAuthMiddleware);
}
