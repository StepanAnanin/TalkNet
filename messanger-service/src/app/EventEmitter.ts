import WebSocket from "ws";
import sendMessageHandler from "../EventHandlers/SendMessageHandler";
import getChatMessagesHandler from "../EventHandlers/GetChatMessagesHandler";
import validateEvent from "../lib/validators/ValidateEvent";
import MessangerServiceResponse from "../lib/MessangerServiceResponse";

import type AnyEvent from "../types/WebSocket/Events";
import type { Socket } from "socket.io";

// TODO socket generics are temp
export default async function EventEmitter(message: string, socket: Socket<any, any, any, any>) {
    const parsedMessage: AnyEvent = JSON.parse(message);

    const validationResult = validateEvent(parsedMessage);

    // @ts-ignore
    if (parsedMessage.event === "connect-to-chats") {
        return;
    }

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
