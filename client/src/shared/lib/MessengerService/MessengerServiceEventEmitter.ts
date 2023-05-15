import type User from "../../types/entities/User";
import type MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";

import LocalStorageController from "../LocalStorageController";
import { MessengerServiceOutcomingEventRequest } from "./MessengerServiceEvent";
import { io } from "socket.io-client";

export default class MessengerServiceEventEmitter {
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

        window.addEventListener("beforeunload", () => {
            console.log("[Messenger Service] Closing connection...");
            this.socket.close();
        });
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

        this.socket.emit(lastOutcomingEvent.name, lastOutcomingEvent.JSON());

        this.wasLastOutcomingEventRequestRepeat = true;
    }

    public emitOutcomingEventRequest(event: MessengerServiceEventModel.OutcomingEvent.Request.Any) {
        const outcomingEvent = new MessengerServiceOutcomingEventRequest(this.user!.id, event);

        this.socket.emit(outcomingEvent.name, outcomingEvent.JSON());

        this.lastOutcomingEventRequest = outcomingEvent;
        this.wasLastOutcomingEventRequestRepeat = false;
    }
}
