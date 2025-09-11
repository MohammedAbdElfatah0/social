import { Express, NextFunction, Request, Response } from "express"
import authRouter from "./modules/auth/auth.controller";
import { connectDB } from "./DB/connectedDB";
export const bootstrap = (app: Express, express: any) => {
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    //user
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
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {

        return res.status(400).json({
            message: err.message,
            success: false,
            errorStack: err.stack,
        });


    });
}