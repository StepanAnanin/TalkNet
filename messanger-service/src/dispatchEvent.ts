import WebSocket from "ws";
import sendMessageHandler from "./EventHandlers/SendMessageHandler";
import getChatMessagesHandler from "./EventHandlers/GetChatMessagesHandler";
import validateEvent from "./lib/validators/ValidateEvent";

import type AnyEvent from "./types/WebSocket/Events";
import { Socket } from "socket.io";
import MessangerServiceResponse from "./lib/MessangerServiceResponse";

// socket generics are temp
export default async function dispatchEvent(message: string, socket: Socket<any, any, any, any>) {
    const parsedMessage: AnyEvent = JSON.parse(message);

    const validationResult = validateEvent(parsedMessage);

    // console.log(message);

    if (!validationResult.ok) {
        socket.send(
            JSON.stringify(
                new MessangerServiceResponse(400, "validation-error", {
                    message: `Validation Error: ${validationResult.message}`,
                })
            )
        );
        return;
    }

    switch (parsedMessage.event) {
        case "send-message":
            await sendMessageHandler(parsedMessage, socket);
            break;
        case "get-chat-messages":
            await getChatMessagesHandler(parsedMessage, socket);
            break;
        default:
            socket.send(JSON.stringify(new MessangerServiceResponse(400, "invalid-request", { message: "Wrong event" })));
            break;
    }
}
