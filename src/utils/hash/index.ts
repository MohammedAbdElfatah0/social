import bcrypt from "bcryptjs";
export const hashPassword= async(password:string)=>{
    const hashPassword=await bcrypt.hash(password,10);   
    return hashPassword;
}
export const comparePassword=async(password:string,hashPassword:string)=>{
    return await bcrypt.compare(password,hashPassword);
}