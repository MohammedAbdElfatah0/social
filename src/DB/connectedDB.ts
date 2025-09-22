import mongoose from "mongoose";
import { devConfig } from "../config/env/dev.config";
export const connectDB=async()=>{
   await mongoose.connect(devConfig.DB_URL as string).
   then(()=>{
    console.log("Connected to MongoDB");
   }).catch((err)=>{
    console.log("Failed to connect to MongoDB",err);
   })
}