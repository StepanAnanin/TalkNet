import "dotenv/config";
import express from "express";
import config from "./config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(config.CORS_OPTIONS));
app.use("/static", express.static(`${__dirname}/static`));

async function start() {
    app.listen(port, () => {
        console.clear();
        console.log(`Server is now runnig on: http://localhost:${port}`);
    });
}

start();
