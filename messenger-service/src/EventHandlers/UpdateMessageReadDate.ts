import type { UpdateMessageReadDate } from "../types/WebSocket/Events";

import WebSocket from "ws";
import http from "http";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";
import { Socket } from "socket.io";

export default async function SendMessageHandler(event: UpdateMessageReadDate, socket: Socket<any, any, any, any>) {
    const requestOptions = new TalkNetAPIRequestOptions(
        `/chat/messages/${event.payload.chatID}/read-date`,
        "PATCH",
        event.accessToken
    );

    // @ts-ignore
    const request = http.request(requestOptions, function (response) {
        response.setEncoding("utf-8");

        const chunks: Buffer[] = [];

        response
            .on("data", function (chunk) {
                chunks.push(Buffer.from(chunk));
            })
            .on("end", function () {
                const stringifiedData = Buffer.concat(chunks).toString("utf8");
                const responsePayload = JSON.parse(stringifiedData);

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

                const chatID = responsePayload.chat;

                if (typeof chatID !== "string") {
                    socket.emit(
                        "unexpected-error",
                        new MessengerServiceResponse(response.statusCode!, "unexpected-error", {
                            message: "[Messenger Service Internal Error] Не удалось получить ID чата",
                        }).JSON()
                    );
                    return;
                }

                socket.emit(
                    "update-message-read-date",
                    new MessengerServiceResponse(200, "update-message-read-date", responsePayload.payload).JSON()
                );

                socket
                    .to(chatID)
                    .emit(
                        "update-message-read-date",
                        new MessengerServiceResponse(200, "update-message-read-date", responsePayload.payload).JSON()
                    );
            });

        // response.on("end", function () {});

        response.on("error", (err) => {
            console.error(err);
        });
    });

    // sending request to the TalkNet API
    request.write(
        JSON.stringify({
            messageID: event.payload.messageID,
            chatID: event.payload.chatID,
            newReadDate: event.payload.newReadDate,
        })
    );

    request.end();
}
