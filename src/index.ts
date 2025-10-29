import { log } from "console";
import express from "express";
import { config } from "dotenv";
config();
import { bootstrap } from "./app.controller";
import { devConfig } from "./config/env/dev.config";
import { initServer } from "./socket-io";

const app = express();
const PORT = devConfig.PORT || 3005;
const server = app.listen(PORT, () => log(`Server running on port ${PORT}`));
bootstrap(app, express);

initServer(server);