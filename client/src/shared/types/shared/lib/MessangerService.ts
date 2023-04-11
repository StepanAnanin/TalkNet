import DialogueChatMessage from "../DialogueChatMessage";
import HTTPStatusCode from "./HTTPStatusCode";

// TODO need to add an additional property for events which will define is it request or response.
// This needed cuz payloads of request and response are different
namespace IMessangerService {
    export type OutcomingEventName = OutcomingEvent.Any["event"];

    export type IncomingEventName = IncomingEvent.Any["event"];

    export type AnyEventName = OutcomingEventName | IncomingEventName;

    /**
     * This events are dispatching by client. Response on this event will have the same event type.
     */
    export namespace OutcomingEvent {
        // TODO remove chatID from there
        interface OutcomingEvent<E extends string> {
            event: E;
            chatID: string | null;

            // usedID is attached in MessangerService module (../src/shared/lib/MessangerService.ts)
            // and exist only in request to the server, but not in the response

            /** Must be override */
            payload: object;
        }

        export interface SendMessage extends OutcomingEvent<"send-message"> {
            payload: {
                chatID: string;
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

        export interface ConnectToChats extends OutcomingEvent<"connect-to-chats"> {
            payload: {
                userChatsIDs: string[];
            };
        }

        export interface GetChatMessages extends OutcomingEvent<"get-chat-messages"> {
            payload: {
                chatID: string;
            };
        }

        export interface EstablishConnection extends OutcomingEvent<"establish-connection"> {
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

    /**
     * This events can be dispatched only by server and most of them are errors.
     */
    export namespace IncomingEvent {
        interface IncomingEvent<P extends object, E extends IncomingEventName> {
            code: HTTPStatusCode;
            event: E;
            chatID: string;
            payload: P;
        }

        export type ReceiveMessage = IncomingEvent<DialogueChatMessage, "receive-message">;

        export type AccessTokenExpiredError<P extends object> = IncomingEvent<P, "access-token-expired">;

        export type InvalidRequest<P extends object> = IncomingEvent<P, "invalid-request">;

        export type ValidationError<P extends object> = IncomingEvent<P, "validation-error">;

        export type UnexpectedError<P extends object> = IncomingEvent<P, "unexpected-error">;

        export type Any =
            | ReceiveMessage
            | AccessTokenExpiredError<object>
            | InvalidRequest<object>
            | ValidationError<object>
            | UnexpectedError<object>;
    }

    export type AnyEvent = OutcomingEvent.Any | IncomingEvent.Any;
}

export default IMessangerService;
