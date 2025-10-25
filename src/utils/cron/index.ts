import { CronJob } from "cron";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
class CronService {
    private readonly postRepository = new PostRepository();
    private readonly commentRepository = new CommentRepository();
    //every day at 00:00:00
    public job = new CronJob('0 0 0 * * *', async () => {
        //delete comment and post after 24 hours
        console.log("start");
        this.deletePostandcomment();
    });
    private deletePostandcomment = async () => {
        //delete comment and post after 24 hours
        const deletePost = await this.postRepository.delete({ freezeAt: { $lt: new Date() }, isFreeze: true });
        const deleteComment = await this.commentRepository.deleteMany({ freezeAt: { $lt: new Date() }, isFreeze: true });
        console.log("deletePost", deletePost);
        console.log("deleteComment", deleteComment);

    }
    //todo delete expirre token
    // private deleteExpirreToken = async () => {
    //     const deleteToken = await this.tokenRepository.delete({ expireAt: { $lt: new Date() } });
    //     console.log("deleteToken", deleteToken);
    // }
}


export default new CronService;
