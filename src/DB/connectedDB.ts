import mongoose from "mongoose";
export const connectDB=async()=>{
   await mongoose.connect(process.env.DB_URL as string).
   then(()=>{
    console.log("Connected to MongoDB");
   }).catch((err)=>{
    console.log("Failed to connect to MongoDB",err);
   })
}