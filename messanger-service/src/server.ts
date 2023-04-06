import "dotenv/config";
import express from "express";
import WebSocket from "ws";
import http from "http";
import dispatchEvent from "./dispatchEvent";
import MessangerServiceResponse from "./lib/MessangerServiceResponse";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

// export const WebSocketServer = new WebSocket.Server({ server });

// checkEnviromentVariables();

// WebSocketServer.on("connection", (ws) => {
//     ws.on("message", (m) => {
//         dispatchEvent(m.toString(), ws);
//     });

//     ws.on("error", (e) => ws.send(e.message));

//     ws.send(
//         JSON.stringify(
//             new MessangerServiceResponse(200, "establish-connection", {
//                 message: "Messanger Service connection established",
//             })
//         )
//     );
// });

// server.listen(process.env.port, () => {
//     console.log(`Messanger server started on: ws://localhost:${process.env.port}`);
// });

//====================================================================================

checkEnviromentVariables();

// add CORS settings for server (it's above)
const io = new Server(server, {
    cors: {
        // TODO will work only in dev mode
        origin: ["http://localhost:3005"],
    },
});

io.on("connection", (socket) => {
    // console.log(socket.id);

    socket.on("message", (m) => {
        dispatchEvent(m.toString(), socket);
    });

    socket.on("error", (e) => socket.send(e.message));

    socket.send(
        JSON.stringify(
            new MessangerServiceResponse(200, "establish-connection", {
                message: "Messanger Service connection established",
            })
        )
    );
});

function checkEnviromentVariables() {
    const expectedEnvVars = ["PORT"];

    for (const enviromentVariable of expectedEnvVars) {
        if (process.env[enviromentVariable] === undefined) {
            throw new TypeError(`Enviroment variable ${enviromentVariable} is missing`);
        }
    }
}

io.listen(parseInt(process.env.PORT!));

console.log(`Messanger server started on: ws://localhost:${process.env.port}`);
