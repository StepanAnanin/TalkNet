import User from "../types/entities/User";
import type IMessangerService from "../types/shared/lib/MessangerService";
import LocalStorageController from "./LocalStorageController";
import { MessangerServiceOutcomingEvent } from "./MessangerServiceEvent";
import { io, Socket } from "socket.io-client";

export default class IOMessengerService {
    public static readonly incomingEventMap: IMessangerService.IncomingEventName[] = [
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
    ];

    public static readonly outcomingEventMap: IMessangerService.OutcomingEventName[] = [
        "delete-message",
        "edite-message",
        "establish-connection",
        "get-chat-messages",
        "send-message",
        "update-message-read-date",
    ];

    public static readonly eventMap: IMessangerService.AnyEventName[] = [
        ...this.incomingEventMap,
        ...this.outcomingEventMap,
    ];

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

        this.socket.emit("message", lastOutcomingEvent.JSON());

        this.wasLastOutcomingEventRepeat = true;
    }

    protected emitEvent(event: IMessangerService.OutcomingEvent.Any) {
        const outcomingEvent = new MessangerServiceOutcomingEvent(this.user!.id, event);

        this.socket.emit("message", outcomingEvent.JSON());

        this.lastOutcomingEvent = outcomingEvent;
    }

    public sendMessage(sendMessageEvent: IMessangerService.OutcomingEvent.SendMessage) {
        this.emitEvent(sendMessageEvent);
    }

    public getChatMessages(getChatMessagesEvent: IMessangerService.OutcomingEvent.GetChatMessages) {
        this.emitEvent(getChatMessagesEvent);
    }
}

export class MessangerService extends WebSocket {
    public static readonly incomingEventMap: IMessangerService.IncomingEventName[] = [
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
    ];

    public static readonly outcomingEventMap: IMessangerService.OutcomingEventName[] = [
        "delete-message",
        "edite-message",
        "establish-connection",
        "get-chat-messages",
        "send-message",
        "update-message-read-date",
    ];

    public static readonly eventMap: IMessangerService.AnyEventName[] = [
        ...this.incomingEventMap,
        ...this.outcomingEventMap,
    ];

    protected user: User;

    protected lastOutcomingEvent: MessangerServiceOutcomingEvent | null = null;

    protected wasLastOutcomingEventRepeat = false;

    constructor(url: string | URL, user: User, protocols?: string | string[]) {
        super(url, protocols);

        this.user = user;

        this.onerror = function (err) {
            console.error(err);
        };

        this.onclose = function (event) {
            if (event.wasClean) {
                console.log("Соединение закрыто чисто");
            } else {
                console.log("Обрыв соединения");
            }
            console.log("Код: " + event.code + " причина: " + event.reason);
        };
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

        if (this.readyState) {
            lastOutcomingEvent.accessToken = LocalStorageController.accessToken.get();

            this.send(lastOutcomingEvent.JSON());

            this.wasLastOutcomingEventRepeat = true;

            return;
        }

        setTimeout(() => this.repeatLastOutcomingEvent(), 50);
    }

    protected wsSend(event: IMessangerService.OutcomingEvent.Any) {
        const outcomingEvent = new MessangerServiceOutcomingEvent(this.user!.id, event);

        if (this.readyState) {
            this.send(outcomingEvent.JSON());
            this.lastOutcomingEvent = outcomingEvent;
            return;
        }

        setTimeout(() => this.wsSend(event), 50);
    }

    public sendMessage(sendMessageEvent: IMessangerService.OutcomingEvent.SendMessage) {
        this.wsSend(sendMessageEvent);
    }

    public getChatMessages(getChatMessagesEvent: IMessangerService.OutcomingEvent.GetChatMessages) {
        this.wsSend(getChatMessagesEvent);
    }
}
