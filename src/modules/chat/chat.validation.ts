import z from "zod";

class ChatValidation {
    //id validation
    private id = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

    public getChatValidation = {
        params: z.object({
            userId: this.id
        })
    }
}
export default new ChatValidation();