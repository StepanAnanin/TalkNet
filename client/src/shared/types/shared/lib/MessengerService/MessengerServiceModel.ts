import IChatMessage from "../../../entities/IChatMessage";
import HTTPStatusCode from "../HTTPStatusCode";

namespace MessengerServiceEventModel {
    export type OutcomingEventName = OutcomingEvent.Request.Any["name"];

    export type IncomingEventName = IncomingEvent.Any["name"];

    export type AnyEventName = OutcomingEventName | IncomingEventName;

    /**
     * This events are dispatching by client. Response on this event will have the same event type.
     */
    export namespace OutcomingEvent {
        // Unspecified in sense of is it request or response
        interface UnspecifiedOutcomingEvent<E extends string> {
            name: E;
            type: "outcoming";

            // Must be override.
            // There are problem with this property typesation. I tried to fix it, but it doesn't work at all, so fuck it.
            payload: any;
        }

        export namespace Request {
            interface OutcomingEventRequest<T extends string> extends UnspecifiedOutcomingEvent<T> {
                severity: "request";
            }

            export interface SendMessage extends OutcomingEventRequest<"send-message"> {
                payload: {
                    chatID: string;
                    message: string;
                    sentDate: number;
                };
            }

            // Not implemented yet
            // export interface EditeMessage extends OutcomingEventRequest<"edite-message"> {
            //   payload: {};
            // }

            // Not implemented yet
            // export interface DeleteMessage extends OutcomingEventRequest<"delete-message"> {
            //   payload: {};
            // }

            export interface UpdateMessageReadDate extends OutcomingEventRequest<"update-message-read-date"> {
                payload: {
                    newReadDate: number;
                    messageID: string;
                    chatID: string;
                };
            }

            export interface ConnectToChats extends OutcomingEventRequest<"connect-to-chats"> {
                payload: {
                    userChatsIDs: string[];
                };
            }

            export interface EstablishConnection extends OutcomingEventRequest<"establish-connection"> {
                // payload: {};
            }

            export type Any =
                // | EditeMessage
                // | DeleteMessage
                SendMessage | UpdateMessageReadDate | ConnectToChats | EstablishConnection;
        }

        // Response must be added only after request
        export namespace Response {
            // prettier-ignore
            interface OutcomingEventResponse<T extends OutcomingEvent.Request.Any["name"]> extends UnspecifiedOutcomingEvent<T> {
                        severity: "response";
                    }

            export interface SendMessage extends OutcomingEventResponse<"send-message"> {
                payload: IChatMessage;
            }

            // Not implemented yet
            // export interface EditeMessage extends OutcomingEventResponse<"edite-message"> {
            //     payload: IChatMessage;
            // }

            // Not implemented yet
            // export interface DeleteMessage extends OutcomingEventResponse<"delete-message"> {
            // payload: IChatMessage;
            // }

            export interface UpdateMessageReadDate extends OutcomingEventResponse<"update-message-read-date"> {
                payload: { message: IChatMessage; index: number };
            }

            export interface ConnectToChats extends OutcomingEventResponse<"connect-to-chats"> {
                payload: {
                    message: string;
                };
            }

            export interface EstablishConnection extends OutcomingEventResponse<"establish-connection"> {
                payload: {
                    message: string;
                };
            }

            export type Any =
                // | EditeMessage
                // | DeleteMessage
                SendMessage | UpdateMessageReadDate | ConnectToChats | EstablishConnection;
        }
    }

    /**
     * This events can be dispatched only by server and most of them are errors.
     */
    export namespace IncomingEvent {
        interface IncomingEvent<P extends object, E extends IncomingEventName> {
            code: HTTPStatusCode;
            name: E;
            type: "incoming";
            payload: P;
        }

        export type ReceiveMessage = IncomingEvent<IChatMessage, "receive-message">;

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

export default MessengerServiceEventModel;
