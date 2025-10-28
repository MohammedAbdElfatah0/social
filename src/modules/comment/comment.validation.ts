import z from "zod";
import { REACTION } from "../../utils";
class CommentValidation {
    paramasId = z.string().regex(/^[0-9a-fA-F]{24}$/);
   public createComment = {
        params: z.object({ postId: this.paramasId.optional() , id: this.paramasId}),
        body: z.object({ content: z.string().min(1).max(500) }),
    }
    public getSpecificComment = {
        params: z.object({ id: this.paramasId }),
    }
    public addReaction = {
        params: z.object({ id: this.paramasId }),
        body: z.object({ reaction: z.enum(REACTION) }),
    }
    public updateComment = {
        params: z.object({ id: this.paramasId }),
        body: z.object({ content: z.string().min(1).max(500) }),
    }
    public deleteComment = {
        params: z.object({ id: this.paramasId }),
    }
    public freezeComment = {
        params: z.object({ id: this.paramasId }),
    }
    public unfreezeComment = {
        params: z.object({ id: this.paramasId }),
    }
}
export default new CommentValidation();