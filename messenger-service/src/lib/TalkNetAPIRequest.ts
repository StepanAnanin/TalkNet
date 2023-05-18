import http from "http";
import { Socket } from "socket.io";
import { eventName } from "./../types/WebSocket/Events";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";

export default function TalkNetAPIRequest(
    event: eventName,
    options: TalkNetAPIRequestOptions,
    socket: Socket<any, any, any, any>,
    emitEventToChat = false
) {
    return http.request(options, function (response) {
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

                const chatID = responsePayload.chat ?? responsePayload.chatID;

                if (typeof chatID !== "string") {
                    socket.emit(
                        "unexpected-error",
                        new MessengerServiceResponse(response.statusCode!, "unexpected-error", {
                            message: "[Messenger Service Internal Error] Не удалось получить ID чата",
                        }).JSON()
                    );
                    return;
                }

                const messengerServiceResponse = new MessengerServiceResponse(
                    200,
                    event,
                    responsePayload.payload ?? responsePayload
                );
                const stringifiedMessengerServiceResponse = messengerServiceResponse.JSON();

                socket.emit(event, stringifiedMessengerServiceResponse);

                if (emitEventToChat) {
                    socket.to(chatID).emit(event, stringifiedMessengerServiceResponse);
                }
            });

        // response.on("end", function () {});

        response.on("error", (err) => {
            console.error(err);
        });
    });
}
