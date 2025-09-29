import { Request, Response, NextFunction } from "express";
import { BadRequestException, NotFoundException, verifyToken } from "../utils";
import { UserRepository } from "../DB";

export const authMiddleware = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new BadRequestException("token is required");
        }
        // const decodedToken=verifyToken({
        //     token:token.split(" ")[1]
        // })
        console.log(token);
        const payload = verifyToken({
            token
        });
        console.log(payload);
        console.log(payload.id);
        const userRepository = new UserRepository();
        const user = await userRepository.exist({
            _id: payload.id,
        });
        console.log(user);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        //TODO::check token is block
        //TODO::check token is expired
        //TODO::check user is logout
        /**
         * const blockToken = await Token.findOne({ token, type: "access" });
        if (blockToken) {
            throw new Error("invalid Token", { cause: 401 });
    
        }
         */
        //check user is reset password
        if (user.credentialUpdataAt.getTime() > payload.iat! * 1000) {
            throw new BadRequestException("Token is expired");
        }
        //[credentials update at]

        req.user = user;
        next();
    };
};