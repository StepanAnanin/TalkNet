import WebSocket from "ws";
import http from "http";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";

import type { SendMessageEvent } from "../types/WebSocket/Events";

export default async function SendMessageEventHandler(event: SendMessageEvent, ws: WebSocket.WebSocket) {
    const requestOptions = new TalkNetAPIRequestOptions("/chat/message/" + event.chatID, "POST", event.accessToken);

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

            console.log(responsePayload);

            // If success
            ws.send(new MessangerServiceResponse(200, "send-message", responsePayload).JSON());
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
