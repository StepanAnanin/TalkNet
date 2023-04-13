import WebSocket from "ws";
import http from "http";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";

import type { GetChatMessagesEvent } from "../types/WebSocket/Events";
import { Socket } from "socket.io";

export default async function GetChatMessagesEventHandler(event: GetChatMessagesEvent, socket: Socket<any, any, any, any>) {
    if (!socket.rooms.has(event.payload.chatID)) {
        socket.emit("access-denied", new MessengerServiceResponse(403, "access-denied", { message: null }).JSON());
        return;
    }

    const requestOptions = new TalkNetAPIRequestOptions("/chat/messages/" + event.payload.chatID, "POST", event.accessToken);

    // TODO move this to a new fuction or class method
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
                console.log(chunk);
                socket.emit(
                    "unexpected-error",
                    new MessengerServiceResponse(response.statusCode!, "unexpected-error", {
                        message: responsePayload.message,
                    }).JSON()
                );
                return;
            }

            // console.log(chunk);

            // If success
            socket.send(new MessengerServiceResponse(200, "get-chat-messages", responsePayload).JSON());
        });

        // response.on("end", function () {});

        response.on("error", (err) => {
            console.error(err);
        });
    });

    // sending request to the TalkNet API
    request.write(JSON.stringify({ userID: event.userID }));

    request.end();
}
