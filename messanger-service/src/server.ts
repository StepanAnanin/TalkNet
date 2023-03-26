import "dotenv/config";
import express from "express";
import WebSocket from "ws";
import http from "http";
import dispatchEvent from "./dispatchEvent";
import MessangerServiceResponse from "./lib/MessangerServiceResponse";

const app = express();

const server = http.createServer(app);

export const WebSocketServer = new WebSocket.Server({ server });

checkEnviromentVariables();

WebSocketServer.on("connection", (ws) => {
    ws.on("message", (m) => {
        dispatchEvent(m.toString(), ws);
    });

    ws.on("error", (e) => ws.send(e.message));

    ws.send(
        JSON.stringify(
            new MessangerServiceResponse(200, "establish-connection", {
                message: "Messanger Service connection established",
            })
        )
    );
});

server.listen(process.env.port, () => {
    console.log(`Messanger server started on: ws://localhost:${process.env.port}`);
});

function checkEnviromentVariables() {
    const expectedEnvVars = ["port"];

    for (const enviromentVariable of expectedEnvVars) {
        if (enviromentVariable === undefined) {
            throw new TypeError(`Enviroment variable ${enviromentVariable} is missing`);
        }
    }
}
