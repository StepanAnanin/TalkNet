import "dotenv/config";
import express from "express";
import http from "http";
import EventController from "./app/EventController";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // TODO will work only in dev mode
        origin: ["http://localhost:3005"],
    },
});

io.on("connection", EventController);

server.listen(process.env.PORT, () => {
    checkEnviromentVariables();

    console.log(`Messenger Service started on: http://localhost:${process.env.PORT}`);
});

function checkEnviromentVariables() {
    const expectedEnvVars = ["PORT"];

    for (const enviromentVariable of expectedEnvVars) {
        if (process.env[enviromentVariable] === undefined) {
            throw new TypeError(`Enviroment variable ${enviromentVariable} is missing`);
        }
    }
}
