import { Request, Response } from "express";
import { ChatRepository } from "../../DB";

class ChatService {
    private chatRepository: ChatRepository = new ChatRepository();
    public getChat = async (req: Request, res: Response) => {
        //get data 
        const { userId } = req.params;
        const userLogin = req.user;
        //search user chat //null
        const chat = await this.chatRepository.getOne({ users: { $all: [userId, userLogin!._id] } }, {}, {
            populate: [{ path: "messages", select: "content" }]
        });
        return res.status(200).json({ messsage: "done", success: true, data: { chat } });
    };
}
export default new ChatService();