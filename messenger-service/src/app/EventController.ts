import type { Socket } from "socket.io";

import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import SendMessageHandler from "../EventHandlers/SendMessageHandler";
import ConnectToChatsHandler from "../EventHandlers/ConnectToChatsHandler";
import UpdateMessageReadDate from "../EventHandlers/UpdateMessageReadDate";

// TODO socket generics are temp
export default function EventController(socket: Socket<any, any, any, any>) {
    socket.on("connect-to-chats", (e) => {
        ConnectToChatsHandler(JSON.parse(e), socket);
    });

    socket.on("send-message", (e) => {
        SendMessageHandler(JSON.parse(e), socket);
    });

    socket.on("update-message-read-date", (e) => {
        UpdateMessageReadDate(JSON.parse(e), socket);
    });

    socket.on("error", (e) => socket.send(e.message));

    socket.emit(
        "establish-connection",
        new MessengerServiceResponse(200, "establish-connection", {
            message: "Messenger Service connection established",
        }).JSON()
    );
}
