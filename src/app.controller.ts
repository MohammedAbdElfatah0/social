import { Express, NextFunction, Request, Response } from "express"
import { authRouter, postRouter } from "./modules";
import { connectDB } from "./DB";
import { AppError } from "./utils";
export const bootstrap = (app: Express, express: any) => {
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    //user
    app.use("/post", postRouter);
    //message
    //comment
    //post
    //*invalid route
    app.use("/{*dummy}", (req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({
            message: "not found route",
            success: false,
        })
    });
    //global error handler
    app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {

        return res.status(400).json({
            message: err.message,
            success: false,
            errorStack: err.stack,
            errorDetails: err.errorDetails
        });


    });
}