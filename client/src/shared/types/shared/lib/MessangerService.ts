import HTTPStatusCode from "./HTTPStatusCode";

namespace IMessangerService {
    /**
     * This events are dispatching by client. Response on this event will have the same event type.
     */
    export type OutcomingEventName =
        | "send-message"
        | "establish-connection"
        | "edite-message"
        | "delete-message"
        | "update-message-read-date";

    /**
     * This events can be dispatched only by server and most of them are errors.
     */
    export type IncomingEventName = "access-token-expired" | "validation-error" | "invalid-request" | "unexpected-error";

    export type AnyEventName = OutcomingEventName | IncomingEventName;

    export namespace OutcomingEvent {
        interface OutcomingEvent<E extends OutcomingEventName> {
            event: E;
            chatID: string;

            /** Must be override */
            payload: object;
        }

        export interface SendMessage extends OutcomingEvent<"send-message"> {
            payload: {
                message: string;
                sentDate: number;
            };
        }

        export interface EditeMessage extends OutcomingEvent<"edite-message"> {
            payload: {
                messageID: string;
                newMessage: string;
                changeDate: number;
            };
        }

        export interface DeleteMessage extends OutcomingEvent<"delete-message"> {
            payload: {
                messageID: string;
            };
        }

        export interface UpdateMessageReadDate extends OutcomingEvent<"update-message-read-date"> {
            payload: {
                messageID: string;
                newReadDate: number;
            };
        }

        export type Any = SendMessage | EditeMessage | DeleteMessage | UpdateMessageReadDate;
    }

    export namespace IncomingEvent {
        interface IncomingEvent<P extends object, E extends IncomingEventName> {
            code: HTTPStatusCode;
            event: E;
            chatID: string;
            payload: P;
        }

        export type AccessTokenExpiredError<P extends object> = IncomingEvent<P, "access-token-expired">;

        export type InvalidRequest<P extends object> = IncomingEvent<P, "invalid-request">;

        export type ValidationError<P extends object> = IncomingEvent<P, "validation-error">;

        export type UnexpectedError<P extends object> = IncomingEvent<P, "unexpected-error">;

        export type Any =
            | AccessTokenExpiredError<object>
            | InvalidRequest<object>
            | ValidationError<object>
            | UnexpectedError<object>;
    }

    export type AnyEvent = OutcomingEvent.Any | IncomingEvent.Any;
}

export default IMessangerService;
