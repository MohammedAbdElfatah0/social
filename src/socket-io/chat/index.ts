import { Server, Socket } from "socket.io";
import { ChatRepository, MessageRepository } from "../../DB";
import { IChat, IMessage } from "../../utils";
import { ObjectId } from "mongoose";
interface ISendMessage { message: string, destId: string }
export const sendMessage = (socket: Socket, io: Server, connectedUser: Map<string, string>) => {
    return async (data: ISendMessage) => {
        //emit 2event
        const destSockerID = connectedUser.get(data.destId);
        socket.emit("successMessage", data);
        io.to(destSockerID as string).emit("receiveMessage", data);
        const senderId = socket.data.user._id;
        const receiverId = data.destId;
        //save into database 
        const messageRepository = new MessageRepository();
        const message = await messageRepository.create({
            content: data.message,
            sender: [senderId],
        } as IMessage);
        const chatRepository = new ChatRepository();
        const chat = await chatRepository.getOne({ users: { $all: [senderId, receiverId] } },);
        if (!chat) {
            await chatRepository.create({
                users: [senderId, receiverId],
                messages: [message._id as unknown as ObjectId],
            } as IChat);
        } else {
            await chatRepository.update({ _id: chat._id }, { $push: { messages: message._id } });
        }
    };
};