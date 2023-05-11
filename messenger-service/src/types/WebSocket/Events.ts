import type SendMessageRequest from "../Requests/SendMessageRequest";
import type ChatMessage from "../api/ChatMessage";

// TODO Require refactoring

export type incomingEvent =
    | "send-message"
    | "establish-connection"
    | "get-chat-messages"
    | "connect-to-chats"
    | "update-message-read-date";

export type outcomingEvent =
    | "receive-message"
    | "access-token-expired"
    | "unexpected-error"
    | "validation-error"
    | "invalid-request"
    | "access-denied";

export type event = incomingEvent | outcomingEvent;

// On changing this don't forget to change event validator
interface ConnectionEvent<E extends incomingEvent | outcomingEvent, P extends object> {
    accessToken: string;
    userID: string;
    event: E;
    payload: P;
}

export type SendMessageEvent = ConnectionEvent<"send-message", SendMessageRequest>;

export type GetChatMessagesEvent = ConnectionEvent<"get-chat-messages", { chatID: string }>;

export type ConnectToChatsEvent = ConnectionEvent<"connect-to-chats", { userChatsIDs: string[] }>;

export type ReceiveMessage = ConnectionEvent<"receive-message", ChatMessage>;

export type AccessDenied = ConnectionEvent<"access-denied", { message: string | null }>;

export type UpdateMessageReadDate = ConnectionEvent<
    "update-message-read-date",
    { chatID: string; messageID: string; newReadDate: number }
>;

type AnyEvent = SendMessageEvent | GetChatMessagesEvent | ConnectToChatsEvent | ReceiveMessage | AccessDenied;

export default AnyEvent;
