namespace MessangerService {
    export namespace Event {
        interface MessangerServiceEvent<E extends string> {
            event: E;
            chatID: string;
        }

        export interface SendMessage extends MessangerServiceEvent<"send-message"> {
            payload: {
                message: string;
                sentDate: number;
            };
        }

        export interface EditeMessage extends MessangerServiceEvent<"edite-message"> {
            payload: {
                messageID: string;
                newMessage: string;
                changeDate: number;
            };
        }

        export interface DeleteMessage extends MessangerServiceEvent<"delete-message"> {
            payload: {
                messageID: string;
            };
        }

        export interface UpdateMessageReadStatus extends MessangerServiceEvent<"update-message-read-status"> {
            payload: {
                messageID: string;
                newStatus: boolean;
            };
        }

        export type Any = SendMessage | EditeMessage | DeleteMessage | UpdateMessageReadStatus;
    }
}

export default MessangerService;
