import WebSocket from "ws";
import http from "http";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";
import TalkNetAPIRequestOptions from "../api/TalkNetAPIRequestOptions";

import type { ConnectToChatsEvent } from "../types/WebSocket/Events";
import type { Socket } from "socket.io";

// TODO Not sure about security vulnerabilities
export default async function connectToChats(event: ConnectToChatsEvent, socket: Socket<any, any, any, any>) {
    const userChatsIDs = event.payload.userChatsIDs;

    if (!userChatsIDs) {
        socket.emit(
            "invalid-request",
            new MessangerServiceResponse(400, "invalid-request", {
                message: "Chats IDs is missing",
            }).JSON()
        );
        return;
    }

    socket.join(userChatsIDs);

    socket.emit(
        "connect-to-chats",
        new MessangerServiceResponse(200, "connect-to-chats", { message: "Connection to chats established" }).JSON()
    );
}
