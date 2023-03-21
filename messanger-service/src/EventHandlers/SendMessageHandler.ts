import { WebSocketServer } from "../server";
import WebSocket from "ws";
import http from "http";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";

import type { SendMessageEvent } from "../types/WebSocket/Events";
import config from "../config";

export default async function SendMessageEventHandler(event: SendMessageEvent, message: string, ws: WebSocket.WebSocket) {
    const requestOptions: http.RequestOptions = {
        host: config.TALKNET_API_HOST,
        port: config.TALKNET_API_PORT,
        path: "/chat/message/" + event.chatID,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + event.accessToken,
        },
    };

    const request = http.request(requestOptions, function (response) {
        response.setEncoding("utf-8");

        const wsResponse = { ok: false, message: "Что-то пошло не так..." };

        response.on("data", function (chunk) {
            const responsePayload = JSON.parse(chunk);

            if (response.statusCode === 401 && responsePayload.tokenExpired) {
                wsResponse.ok = false;
                ws.send(JSON.stringify(new MessangerServiceResponse(response.statusCode, responsePayload.message)));
                return;
            }

            console.log(responsePayload);

            wsResponse.ok = true;
            wsResponse.message = responsePayload;

            // console.log(responsePayload);
            // console.log(`\nSend message event dispatched.\nRequest: ${JSON.stringify(event)}\n`);
        });

        response.on("end", function () {
            if (wsResponse.ok) {
                ws.send(JSON.stringify(new MessangerServiceResponse(200, wsResponse.message)));
                return;
            }

            ws.send(JSON.stringify(new MessangerServiceResponse(500, wsResponse.message)));
        });

        response.on("error", (err) => {
            console.error(err);
        });
    });

    request.write(
        JSON.stringify({ senderID: event.userID, messageText: event.payload.message, sentDate: event.payload.sentDate })
    );
    request.end();
}
