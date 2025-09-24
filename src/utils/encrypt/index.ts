//npm i --save-dev @types/crypto-js
import crypto from "crypto-js";
import { devConfig } from "../../config/env/dev.config";

//encrypt data
export const encryptData=(data:string)=>{
    return crypto.AES.encrypt(data, devConfig.SECRET_KEY!).toString();
}
//decrypt data
export const decryptData=(data:string)=>{
    const bytes = crypto.AES.decrypt(data, devConfig.SECRET_KEY!);
    return bytes.toString(crypto.enc.Utf8);
}