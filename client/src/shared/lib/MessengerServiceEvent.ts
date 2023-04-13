import type MessengerServiceModel from "../types/shared/lib/MessengerServiceModel";
import LocalStorageController from "./LocalStorageController";

// It's done a bit crooked, cuz on outcoming event response and request a different only in payload and type
type AnyEvent =
    | MessengerServiceModel.OutcomingEvent.Request.Any
    | MessengerServiceModel.OutcomingEvent.Response.Any
    | MessengerServiceModel.IncomingEvent.Any;

class MessengerServiceUnspecifiedEvent<E extends AnyEvent> {
    public readonly event: MessengerServiceModel.AnyEventName;
    public readonly userID: string;
    public readonly payload: E["payload"]; // TODO fix typesation for payload, now doesn't work like should

    public JSON() {
        return JSON.stringify(this);
    }

    constructor(userID: string, MessengerServiceEvent: E) {
        this.userID = userID;
        this.event = MessengerServiceEvent.event;
        this.payload = MessengerServiceEvent.payload;
    }
}

export class MessengerServiceOutcomingEventRequest<
    E extends MessengerServiceModel.OutcomingEvent.Request.Any = MessengerServiceModel.OutcomingEvent.Request.Any
> extends MessengerServiceUnspecifiedEvent<E> {
    public readonly type = "request";
    public accessToken = LocalStorageController.accessToken.get();
}

export class MessengerServiceOutcomingEventResponse<
    E extends MessengerServiceModel.OutcomingEvent.Response.Any = MessengerServiceModel.OutcomingEvent.Response.Any
> extends MessengerServiceUnspecifiedEvent<E> {
    public readonly type = "response";
}

export class MessengerServiceIncomingEvent<
    E extends MessengerServiceModel.IncomingEvent.Any = MessengerServiceModel.IncomingEvent.Any
> extends MessengerServiceUnspecifiedEvent<E> {}
