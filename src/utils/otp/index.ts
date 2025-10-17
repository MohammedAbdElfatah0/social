import { encryptData } from "..";

export const generateOTP=()=>{
 const otp=Math.floor(Math.random()*99999+10000);//number is 5 digits
 return encryptData(otp.toString());   
}

export const generateOtpExpiryAt=(minutes:number=1)=>{
    const expiryAt=new Date(Date.now()+minutes*60*1000);
    return expiryAt;
}