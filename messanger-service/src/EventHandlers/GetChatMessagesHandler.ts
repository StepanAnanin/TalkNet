import WebSocket from "ws";
import http from "http";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";

import type { GetChatMessagesEvent } from "../types/WebSocket/Events";

export default async function GetChatMessagesEventHandler(event: GetChatMessagesEvent, ws: WebSocket.WebSocket) {
    const requestOptions = new TalkNetAPIRequestOptions("/chat/messages/" + event.chatID, "POST", event.accessToken);

    // TODO move this to a new fuction or class method
    // @ts-ignore
    const request = http.request(requestOptions, function (response) {
        response.setEncoding("utf-8");

        response.on("data", function (chunk) {
            const responsePayload = JSON.parse(chunk);

            // Checking access token
            if (response.statusCode === 401 && responsePayload.tokenExpired) {
                ws.send(
                    new MessangerServiceResponse(response.statusCode, "access-token-expired", {
                        message: responsePayload.message,
                    }).JSON()
                );
                return;
            }

            // If error
            if (response.statusCode! >= 400) {
                ws.send(
                    new MessangerServiceResponse(response.statusCode!, "unexpected-error", {
                        message: responsePayload.message,
                    }).JSON()
                );
                return;
            }

            // If success
            ws.send(new MessangerServiceResponse(200, "get-chat-messages", responsePayload).JSON());
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