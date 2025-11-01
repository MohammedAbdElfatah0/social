import { GraphQLError } from "graphql";
import { UserRepository } from "../DB";
import { verifyToken } from "../utils";

export const authMiddlewareGraphql = async (context:any) => {
    console.log(context);
    const token = context.auth.authorization;
    if (!token) {
        throw new GraphQLError("token is required");
    }
    // const decodedToken=verifyToken({
    //     token:token.split(" ")[1]
    // })

    const payload = verifyToken({
        token
    });
    const userRepository = new UserRepository();
    const user = await userRepository.exist(
        {
            _id: payload.id,
        });
    if (!user) {
        throw new GraphQLError("User not found");
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
        throw new GraphQLError("Token is expired");
    }
    //[credentials update at]

    context.user = user;

};
