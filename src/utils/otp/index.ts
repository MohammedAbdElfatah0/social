export const generateOTP=()=>{
 const otp=Math.floor(Math.random()*99999+10000);
 return otp.toString();   
}

export const generateOtpExpiryAt=(minutes:number=1)=>{
    const expiryAt=new Date(Date.now()+minutes*60*1000);
    return expiryAt;
}