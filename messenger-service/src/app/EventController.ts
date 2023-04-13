import type { Socket } from "socket.io";

import EventEmitter from "./EventEmitter";
import MessengerServiceResponse from "../lib/MessengerServiceResponse";
import SendMessageHandler from "../EventHandlers/SendMessageHandler";
import GetChatMessagesHandler from "../EventHandlers/GetChatMessagesHandler";
import ConnectToChatsHandler from "../EventHandlers/ConnectToChatsHandler";

// TODO socket generics are temp
export default function EventController(socket: Socket<any, any, any, any>) {
    socket.on("connect-to-chats", (e) => {
        ConnectToChatsHandler(JSON.parse(e), socket);
    });

    socket.on("send-message", (e) => {
        SendMessageHandler(JSON.parse(e), socket);
    });

    // socket.on("disconnect", () => {
    //     console.log("User disconnected");
    // });

    socket.on("get-chat-messages", (e) => {
        GetChatMessagesHandler(JSON.parse(e), socket);
    });

    socket.on("error", (e) => socket.send(e.message));

    socket.emit(
        "establish-connection",
        new MessengerServiceResponse(200, "establish-connection", {
            message: "Messenger Service connection established",
        }).JSON()
    );
}
