import type User from "../types/entities/User";
import type MessengerServiceModel from "../types/shared/lib/MessengerServiceModel";

import LocalStorageController from "./LocalStorageController";
import { MessengerServiceOutcomingEventRequest } from "./MessengerServiceEvent";
import { io, Socket } from "socket.io-client";

export default class MessengerServiceConnection {
    public static readonly IncomingEventsMap: readonly MessengerServiceModel.IncomingEventName[] = [
        "receive-message",
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
        "access-denied",
    ] as const;

    public static readonly OutcomingEventsMap: readonly MessengerServiceModel.OutcomingEventName[] = [
        "delete-message",
        "edite-message",
        "establish-connection",
        "connect-to-chats",
        "get-chat-messages",
        "send-message",
        "update-message-read-date",
        "update-message-read-date",
    ] as const;

    public static readonly EventsMap: readonly MessengerServiceModel.AnyEventName[] = [
        ...this.IncomingEventsMap,
        ...this.OutcomingEventsMap,
    ] as const;

    protected readonly socket: ReturnType<typeof io>;

    protected user: User;

    protected lastOutcomingEventRequest: MessengerServiceOutcomingEventRequest | null = null;

    protected wasLastOutcomingEventRequestRepeat = false;

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

    public repeatLastOutcomingEventRequest() {
        const lastOutcomingEvent = this.lastOutcomingEventRequest;

        if (!lastOutcomingEvent) {
            console.warn(`There are no previous outcoming events`);
            return;
        }

        if (this.wasLastOutcomingEventRequestRepeat) {
            return;
        }

        lastOutcomingEvent.accessToken = LocalStorageController.accessToken.get();

        this.socket.emit(lastOutcomingEvent.event, lastOutcomingEvent.JSON());

        this.wasLastOutcomingEventRequestRepeat = true;
    }

    protected emitEvent(event: MessengerServiceModel.OutcomingEvent.Request.Any) {
        const outcomingEvent = new MessengerServiceOutcomingEventRequest(this.user!.id, event);

        this.socket.emit(outcomingEvent.event, outcomingEvent.JSON());

        this.lastOutcomingEventRequest = outcomingEvent;
        this.wasLastOutcomingEventRequestRepeat = false;
    }

    public sendMessage(sendMessageEvent: MessengerServiceModel.OutcomingEvent.Request.SendMessage) {
        this.emitEvent(sendMessageEvent);
    }

    public connectToChats(connectToChatsEvent: MessengerServiceModel.OutcomingEvent.Request.ConnectToChats) {
        this.emitEvent(connectToChatsEvent);
    }

    public getChatMessages(getChatMessagesEvent: MessengerServiceModel.OutcomingEvent.Request.GetChatMessages) {
        this.emitEvent(getChatMessagesEvent);
    }

    public updateMessageReadDate(
        updateMessageReadDateEvent: MessengerServiceModel.OutcomingEvent.Request.UpdateMessageReadDate
    ) {
        this.emitEvent(updateMessageReadDateEvent);
    }
}
