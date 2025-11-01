import userRouter from "./user/user.controller";
import authRouter from "./auth/auth.controller";
import { commentRouter } from "./comment/comment.controller";
import postRouter from "./post/post.controller";
import chatRouter from "./chat/chat.controller";
export * from "./post/graphql";
export * from "./user/graphql";
export { authRouter, postRouter, commentRouter, userRouter, chatRouter }