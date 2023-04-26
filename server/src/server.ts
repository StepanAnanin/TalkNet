import "dotenv/config";
import express from "express";
import config from "./config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import UserRouter from "./routers/UserRouter";
import ChatRouter from "./routers/ChatRouter";
import SearchRouter from "./routers/SearchRouter";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(config.CORS_OPTIONS));
app.use("/user", UserRouter);
app.use("/chat", ChatRouter);
app.use("/search", SearchRouter);
app.use("/static", express.static(`${__dirname}/static`));

async function start() {
    console.clear();

    console.group("Server startup initialization...");

    console.log(`Checking enviroment variables...`);

    if (!checkEnviromentVariables()) {
        throw new Error(`Server start failed: Missing required local enviroment(-s)`);
    }

    console.log(`Checking enviroment variables: OK`);

    try {
        console.log(`Connecting to database...`);

        await mongoose.connect(process.env.DB_CONNECTION_URL!);

        console.log(`Connecting to database: OK`);

        console.log(`Server start...`);

        console.groupEnd();

        app.listen(port, () => {
            console.log(`Server is now runnig on: http://localhost:${port}`);
        });
    } catch (err) {
        console.groupEnd();

        console.error(err);
    }
}

function checkEnviromentVariables() {
    return !(!process.env.SERVER_PORT || !process.env.DB_CONNECTION_URL || !process.env.SMTP_PASSWORD);
}

start();
