import type { SendMessageEvent } from "../types/WebSocket/Events";

import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";
import { Socket } from "socket.io";
import TalkNetAPIRequest from "../lib/TalkNetAPIRequest";

export default async function SendMessageHandler(event: SendMessageEvent, socket: Socket<any, any, any, any>) {
    const requestOptions = new TalkNetAPIRequestOptions("/chat/message/" + event.payload.chatID, "POST", event.accessToken);

    const request = TalkNetAPIRequest(event.name, requestOptions, socket, true);

    request.write(
        JSON.stringify({ senderID: event.userID, messageText: event.payload.message, sentDate: event.payload.sentDate })
    );

    request.end();
}
