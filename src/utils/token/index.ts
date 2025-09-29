import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
//TODO::: add secret key for refresh token 
export const generateToken = ({
    payload,
    secretKey = devConfig.JWT_SECRET_KEY_ACCESS_TOKEN!,
    options
}: {
    payload: object,
    secretKey?: string,
    options?: SignOptions
}) => {
    return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({
    token,
    secretKey = devConfig.JWT_SECRET_KEY_ACCESS_TOKEN!
}: {
    token: string,
    secretKey?: string
}) => {
    return jwt.verify(token, secretKey) as JwtPayload;
};