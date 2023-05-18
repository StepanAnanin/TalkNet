import { eventName } from "../types/WebSocket/Events";

type EventType = "outcoming" | "incoming";

// For server outcoming event from client is incoming
// and incoming event from client is outcoming.
// Arrays below are already consider this in their names.

const OutcomingEventsMap = [
    "send-message",
    "establish-connection",
    "get-chat-messages",
    "connect-to-chats",
    "update-message-read-date",
];

const IncomingEventsMap = [
    "receive-message",
    "access-token-expired",
    "unexpected-error",
    "validation-error",
    "invalid-request",
    "access-denied",
];

export default class MessengerServiceResponse<P extends object> {
    public readonly code: number;
    public readonly name: eventName;
    public readonly type: EventType;
    public readonly severity: "response" | "request" | undefined;
    public readonly payload: P;

    public JSON() {
        return JSON.stringify(this);
    }

    constructor(code: number, name: eventName, payload: P) {
        this.code = code;
        this.name = name;
        this.payload = payload;

        let eventType: EventType | undefined;

        if (OutcomingEventsMap.includes(name)) {
            eventType = "outcoming";
            this.severity = "response";
        }

        if (IncomingEventsMap.includes(name)) {
            eventType = "incoming";
        }

        if (!eventType) {
            throw new TypeError("Invalid event type");
        }

        this.type = eventType;
    }
}
