import { config } from "dotenv";
config();
export const devConfig = {
    // #Database
    DB_URL: process.env.DB_URL,
    // #JWT
    JWT_SECRET_KEY_ACCESS_TOKEN: process.env.JWT_SECRET_KEY_ACCESS_TOKEN,//access token
    JWT_SECRET_KEY_REFRESH_TOKEN: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,//refresh token
    // #Secret for encrypt
    SECRET_KEY: process.env.SECRET_KEY,
    // #servise
    PORT: process.env.PORT,

    // #Gmail
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    USER_EMAIL: process.env.USER_EMAIL,
    PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
}