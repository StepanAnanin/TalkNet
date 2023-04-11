import type SendMessageRequest from "../Requests/SendMessageRequest";
import type ChatMessage from "../api/ChatMessage";

// TODO Require refactoring

export type incomingEvent = "send-message" | "establish-connection" | "get-chat-messages" | "connect-to-chats";

export type outcomingEvent =
    | "receive-message"
    | "access-token-expired"
    | "unexpected-error"
    | "validation-error"
    | "invalid-request";

export type event = incomingEvent | outcomingEvent;

// On changing this don't forget to change event validator
interface ConnectionEvent<E extends incomingEvent | outcomingEvent, P extends object> {
    accessToken: string;
    userID: string;
    event: E;
    chatID: string;
    payload: P;
}

export type SendMessageEvent = ConnectionEvent<"send-message", SendMessageRequest>;

export type GetChatMessagesEvent = ConnectionEvent<"get-chat-messages", { userID: string }>;

export type ConnectToChatsEvent = ConnectionEvent<"connect-to-chats", { userChatsIDs: string[] }>;

export type ReceiveMessage = ConnectionEvent<"receive-message", ChatMessage>;

type AnyEvent = SendMessageEvent | GetChatMessagesEvent | ConnectToChatsEvent | ReceiveMessage;

export default AnyEvent;
