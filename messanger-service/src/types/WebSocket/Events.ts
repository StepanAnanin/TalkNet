import type SendMessageRequest from "../Requests/SendMessageRequest";

export type incomingEvent = "send-message" | "establish-connection" | "get-chat-messages";

export type outcomingEvent = "access-token-expired" | "unexpected-error" | "validation-error" | "invalid-request";

export type event = incomingEvent | outcomingEvent;

// On changing this don't forget to change event validator
interface ConnectionEvent<E extends incomingEvent, P extends object> {
    accessToken: string;
    userID: string;
    event: E;
    chatID: string;
    payload: P;
}

export type SendMessageEvent = ConnectionEvent<"send-message", SendMessageRequest>;

export type GetChatMessagesEvent = ConnectionEvent<"get-chat-messages", { userID: string }>;

type AnyEvent = SendMessageEvent | GetChatMessagesEvent;

export default AnyEvent;
