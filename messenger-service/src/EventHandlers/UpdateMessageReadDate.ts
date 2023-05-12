import type { UpdateMessageReadDate } from "../types/WebSocket/Events";

import WebSocket from "ws";
import http from "http";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";
import { Socket } from "socket.io";
import TalkNetAPIRequest from "../lib/TalkNetApiRequest";

export default async function SendMessageHandler(event: UpdateMessageReadDate, socket: Socket<any, any, any, any>) {
    const requestOptions = new TalkNetAPIRequestOptions(
        `/chat/messages/${event.payload.chatID}/read-date`,
        "PATCH",
        event.accessToken
    );

    const request = TalkNetAPIRequest(event.event, requestOptions, socket, true);

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
