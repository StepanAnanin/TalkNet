import type SendMessageRequest from "../Requests/SendMessageRequest";

// On changing this don't forget to change event validator
interface ConnectionEvent<E extends string, P extends object> {
    accessToken: string;
    userID: string;
    chatID: string;
    event: E;
    payload: P;
}

export type SendMessageEvent = ConnectionEvent<"send-message", SendMessageRequest>;

type AnyEvent = SendMessageEvent;

export default AnyEvent;
