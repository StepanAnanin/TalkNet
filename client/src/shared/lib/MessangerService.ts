import User from "../types/entities/User";
import type IMessangerService from "../types/shared/lib/MessangerService";
import LocalStorageController from "./LocalStorageController";
import { MessangerServiceOutcomingEvent } from "./MessangerServiceEvent";
import { io, Socket } from "socket.io-client";

export default class IMessengerService {
    public static readonly incomingEventMap: readonly IMessangerService.IncomingEventName[] = [
        "receive-message",
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
    ] as const;

    public static readonly outcomingEventMap: readonly IMessangerService.OutcomingEventName[] = [
        "delete-message",
        "edite-message",
        "establish-connection",
        "connect-to-chats",
        "get-chat-messages",
        "send-message",
        "update-message-read-date",
    ] as const;

    public static readonly eventMap: readonly IMessangerService.AnyEventName[] = [
        ...this.incomingEventMap,
        ...this.outcomingEventMap,
    ] as const;

    protected readonly socket: ReturnType<typeof io>;

    protected user: User;

    protected lastOutcomingEvent: MessangerServiceOutcomingEvent | null = null;

    protected wasLastOutcomingEventRepeat = false;

    constructor(user: User, socket: ReturnType<typeof io>) {
        this.user = user;
        this.socket = socket;

        this.socket.on("error", function (err) {
            console.error(err);
        });

        this.socket.on("close", function (event) {
            if (event.wasClean) {
                console.log("[Messenger Service] Соединение закрыто чисто");
            } else {
                console.log("[Messenger Service] Обрыв соединения");
            }
            console.log("[Messenger Service] Код: " + event.code + " причина: " + event.reason);
        });

        this.socket.on("connect-to-chats", function (event) {
            const parsedEvent = JSON.parse(event);

            console.log("[Messenger Service] " + parsedEvent.payload.message);
        });
    }

    public close() {
        this.socket.close();
    }

    public repeatLastOutcomingEvent() {
        const lastOutcomingEvent = this.lastOutcomingEvent;

        if (!lastOutcomingEvent) {
            console.warn(`There are no previous outcoming events`);
            return;
        }

        if (this.wasLastOutcomingEventRepeat) {
            return;
        }

        lastOutcomingEvent.accessToken = LocalStorageController.accessToken.get();

        this.socket.emit(lastOutcomingEvent.event, lastOutcomingEvent.JSON());

        this.wasLastOutcomingEventRepeat = true;
    }

    protected emitEvent(event: IMessangerService.OutcomingEvent.Any) {
        const outcomingEvent = new MessangerServiceOutcomingEvent(this.user!.id, event);

        this.socket.emit(outcomingEvent.event, outcomingEvent.JSON());

        this.lastOutcomingEvent = outcomingEvent;
    }

    public sendMessage(sendMessageEvent: IMessangerService.OutcomingEvent.SendMessage) {
        this.emitEvent(sendMessageEvent);
    }

    public connectToChats(connectToChatsEvent: IMessangerService.OutcomingEvent.ConnectToChats) {
        this.emitEvent(connectToChatsEvent);
    }

    public getChatMessages(getChatMessagesEvent: IMessangerService.OutcomingEvent.GetChatMessages) {
        this.emitEvent(getChatMessagesEvent);
    }
}
