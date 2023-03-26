import type SendMessageRequest from "../Requests/SendMessageRequest";

export type defaultEvent = "send-message" | "establish-connection";

export type errorEvent = "access-token-expired" | "unexpected-error" | "validation-error" | "invalid-request";

export type event = defaultEvent | errorEvent;

// On changing this don't forget to change event validator
interface ConnectionEvent<E extends defaultEvent, P extends object> {
    accessToken: string;
    userID: string;
    event: E;
    chatID: string;
    payload: P;
}

export type SendMessageEvent = ConnectionEvent<"send-message", SendMessageRequest>;

type AnyEvent = SendMessageEvent;

export default AnyEvent;
