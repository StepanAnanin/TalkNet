import type { Socket } from "socket.io";

import EventEmitter from "./EventEmitter";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";
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

    socket.send(
        JSON.stringify(
            new MessangerServiceResponse(200, "establish-connection", {
                message: "Messanger Service connection established",
            })
        )
    );
}
