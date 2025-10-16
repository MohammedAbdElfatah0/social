//npm i --save-dev @types/crypto-js
import CryptoJS from "crypto-js";
import { devConfig } from "../../config/env/dev.config";

const key = devConfig.SECRET_KEY;
//encrypt data
export const encryptData = (data: string) => {
    if (!key) {
        throw new Error("SECRET_KEY is not set. Please define SECRET_KEY in your environment.");
    }
    if (!data) {
        return "";
    }
    return CryptoJS.AES.encrypt(data, key).toString();
}

//decrypt data
export const decryptData = (data: string) => {

    if (!key) {
        throw new Error("SECRET_KEY is not set. Please define SECRET_KEY in your environment.");
    }
    if (!data) {
        return "";
    }
    const bytes = CryptoJS.AES.decrypt(data, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData || "";
}