import MessengerServiceResponse from "../lib/MessengerServiceResponse";

import type { ConnectToChatsEvent } from "../types/WebSocket/Events";
import type { Socket } from "socket.io";

// TODO Not sure about security vulnerabilities
export default async function ConnectToChatsHandler(event: ConnectToChatsEvent, socket: Socket<any, any, any, any>) {
    const userChatsIDs = event.payload.userChatsIDs;

    if (!userChatsIDs) {
        socket.emit(
            "invalid-request",
            new MessengerServiceResponse(400, "invalid-request", {
                message: "Chats IDs is missing",
            }).JSON()
        );
        return;
    }

    socket.join(userChatsIDs);

    socket.emit(
        "connect-to-chats",
        new MessengerServiceResponse(200, "connect-to-chats", { message: "Connection to chats established" }).JSON()
    );
}
