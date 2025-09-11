import {log} from "console";
import express from "express";
import { config } from "dotenv";
import { bootstrap } from "./app.controller";
config({path:"./config/.env.local"});
const app=express();
const PORT=process.env.PORT||3005; 
app.listen(PORT,()=>log(`Server running on port ${PORT}`));
bootstrap(app,express);
