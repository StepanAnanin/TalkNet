import WebSocket from "ws";
import sendMessageHandler from "./EventHandlers/SendMessageHandler";
import getChatMessagesHandler from "./EventHandlers/GetChatMessagesHandler";
import validateEvent from "./lib/validators/ValidateEvent";

import type AnyEvent from "./types/WebSocket/Events";
import MessangerServiceResponse from "./lib/MessangerServiceResponse";

export default async function dispatchEvent(message: string, ws: WebSocket.WebSocket) {
    const parsedMessage: AnyEvent = JSON.parse(message);

    const validationResult = validateEvent(parsedMessage);

    if (!validationResult.ok) {
        ws.send(
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
            await sendMessageHandler(parsedMessage, ws);
            break;
        case "get-chat-messages":
            await getChatMessagesHandler(parsedMessage, ws);
            break;
        default:
            ws.send(JSON.stringify(new MessangerServiceResponse(400, "invalid-request", { message: "Wrong event" })));
            break;
    }
}
