import User from "../types/entities/User";
import type IMessangerService from "../types/shared/lib/MessangerService";
import LocalStorageController from "./LocalStorageController";
import { MessangerServiceOutcomingEvent } from "./MessangerServiceEvent";

export default class MessangerService extends WebSocket {
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
