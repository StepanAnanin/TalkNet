import DialogueChat from "../../features/DialogueChat";
import DialogueChatMessage from "../DialogueChatMessage";
import HTTPStatusCode from "./HTTPStatusCode";

namespace MessengerServiceModel {
    export type OutcomingEventName = OutcomingEvent.Request.Any["event"];

    export type IncomingEventName = IncomingEvent.Any["event"];

    export type AnyEventName = OutcomingEventName | IncomingEventName;

    /**
     * This events are dispatching by client. Response on this event will have the same event type.
     */
    export namespace OutcomingEvent {
        // Unspecified in sense of is it request or response
        interface UnspecifiedOutcomingEvent<E extends string> {
            event: E;

            // Must be override
            payload: object;
        }

        export namespace Request {
            interface OutcomingEventRequest<T extends string> extends UnspecifiedOutcomingEvent<T> {
                type: "request";
            }

            export interface SendMessage extends OutcomingEventRequest<"send-message"> {
                payload: {
                    chatID: string;
                    message: string;
                    sentDate: number;
                };
            }

            // Not implemented yet
            export interface EditeMessage extends OutcomingEventRequest<"edite-message"> {
                payload: {};
            }

            // Not implemented yet
            export interface DeleteMessage extends OutcomingEventRequest<"delete-message"> {
                payload: {};
            }

            // Not implemented yet
            export interface UpdateMessageReadDate extends OutcomingEventRequest<"update-message-read-date"> {
                payload: {};
            }

            export interface ConnectToChats extends OutcomingEventRequest<"connect-to-chats"> {
                payload: {
                    userChatsIDs: string[];
                };
            }

            export interface GetChatMessages extends OutcomingEventRequest<"get-chat-messages"> {
                payload: {
                    chatID: string;
                };
            }

            export interface EstablishConnection extends OutcomingEventRequest<"establish-connection"> {
                payload: {};
            }

            export type Any =
                | SendMessage
                | EditeMessage
                | DeleteMessage
                | UpdateMessageReadDate
                | GetChatMessages
                | ConnectToChats
                | EstablishConnection;
        }

        // Response must be added only after request
        export namespace Response {
            // prettier-ignore
            interface OutcomingEventResponse<T extends OutcomingEvent.Request.Any["event"]> extends UnspecifiedOutcomingEvent<T> {
                        type: "response";
                    }

            export interface SendMessage extends OutcomingEventResponse<"send-message"> {
                payload: DialogueChatMessage;
            }

            // Not implemented yet
            export interface EditeMessage extends OutcomingEventResponse<"edite-message"> {
                payload: DialogueChatMessage;
            }

            // Not implemented yet
            export interface DeleteMessage extends OutcomingEventResponse<"delete-message"> {
                payload: DialogueChatMessage;
            }

            // Not implemented yet
            export interface UpdateMessageReadDate extends OutcomingEventResponse<"update-message-read-date"> {
                payload: DialogueChatMessage;
            }

            export interface ConnectToChats extends OutcomingEventResponse<"connect-to-chats"> {
                payload: {
                    message: string;
                };
            }

            export interface GetChatMessages extends OutcomingEventResponse<"get-chat-messages"> {
                payload: DialogueChat[];
            }

            export interface EstablishConnection extends OutcomingEventResponse<"establish-connection"> {
                payload: {
                    message: string;
                };
            }

            export type Any =
                | SendMessage
                | EditeMessage
                | DeleteMessage
                | UpdateMessageReadDate
                | GetChatMessages
                | ConnectToChats
                | EstablishConnection;
        }
    }

    /**
     * This events can be dispatched only by server and most of them are errors.
     */
    export namespace IncomingEvent {
        interface IncomingEvent<P extends object, E extends IncomingEventName> {
            code: HTTPStatusCode;
            event: E;
            payload: P;
        }

        export type ReceiveMessage = IncomingEvent<DialogueChatMessage, "receive-message">;

        export type AccessTokenExpiredError<P extends object> = IncomingEvent<P, "access-token-expired">;

        export type InvalidRequest<P extends object> = IncomingEvent<P, "invalid-request">;

        export type ValidationError<P extends object> = IncomingEvent<P, "validation-error">;

        export type UnexpectedError<P extends object> = IncomingEvent<P, "unexpected-error">;

        export type AccessDenied = IncomingEvent<{ message: string | null }, "access-denied">;

        export type Any =
            | ReceiveMessage
            | AccessTokenExpiredError<object>
            | InvalidRequest<object>
            | ValidationError<object>
            | UnexpectedError<object>
            | AccessDenied;
    }

    export type AnyEvent = OutcomingEvent.Request.Any | OutcomingEvent.Response.Any | IncomingEvent.Any;
}

export default MessengerServiceModel;
