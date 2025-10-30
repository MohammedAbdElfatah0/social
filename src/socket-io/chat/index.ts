import { Server, Socket } from "socket.io";
interface ISendMessage { message: string, destId: string }
export const sendMessage = (socket: Socket, io: Server, connectedUser: Map<string, string>) => {
    return (data: ISendMessage) => {
        //emit 2event
        const destSockerID = connectedUser.get(data.destId);
        socket.emit("successMessage", data);
        io.to(destSockerID as string).emit("receiveMessage", data);
    };
};