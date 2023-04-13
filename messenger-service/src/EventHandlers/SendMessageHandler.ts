import type { SendMessageEvent } from "../types/WebSocket/Events";

import WebSocket from "ws";
import http from "http";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";
import { Socket } from "socket.io";

export default async function SendMessageHandler(event: SendMessageEvent, socket: Socket<any, any, any, any>) {
    const requestOptions = new TalkNetAPIRequestOptions("/chat/message/" + event.payload.chatID, "POST", event.accessToken);

    // @ts-ignore
    const request = http.request(requestOptions, function (response) {
        response.setEncoding("utf-8");

        response.on("data", function (chunk) {
            const responsePayload = JSON.parse(chunk);

            // Checking access token
            if (response.statusCode === 401 && responsePayload.tokenExpired) {
                socket.emit(
                    "access-token-expired",
                    new MessengerServiceResponse(response.statusCode, "access-token-expired", {
                        message: responsePayload.message,
                    }).JSON()
                );
                return;
            }

            // If error
            if (response.statusCode! >= 400) {
                socket.emit(
                    "unexpected-error",
                    new MessengerServiceResponse(response.statusCode!, "unexpected-error", {
                        message: responsePayload.message,
                    }).JSON()
                );
                return;
            }

            const chatID = responsePayload.chatID;

            if (typeof chatID !== "string") {
                socket.emit(
                    "unexpected-error",
                    new MessengerServiceResponse(response.statusCode!, "unexpected-error", {
                        message: "[Messenger Service Internal Error] Не удалось получить ID чата",
                    }).JSON()
                );
                return;
            }

            // If success
            socket.emit("send-message", new MessengerServiceResponse(200, "send-message", responsePayload).JSON());

            socket
                .to(chatID)
                .emit("receive-message", new MessengerServiceResponse(200, "receive-message", responsePayload).JSON());
        });

        // response.on("end", function () {});

        response.on("error", (err) => {
            console.error(err);
        });
    });

    // sending request to the TalkNet API
    request.write(
        JSON.stringify({ senderID: event.userID, messageText: event.payload.message, sentDate: event.payload.sentDate })
    );

    request.end();
}
