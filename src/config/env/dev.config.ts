import { config } from "dotenv";
config();
export const devConfig = {
    // #Database
    DB_URL: process.env.DB_URL,

    // #servise
    PORT: process.env.PORT,

    // #Gmail
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    USER_EMAIL: process.env.USER_EMAIL,
    PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
}