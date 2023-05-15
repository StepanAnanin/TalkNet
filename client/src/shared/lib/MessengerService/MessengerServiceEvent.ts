import type MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";
import LocalStorageController from "../LocalStorageController";

// It's done a bit crooked, cuz on outcoming event response and request a different only in payload and type
type AnyEvent =
    | MessengerServiceEventModel.OutcomingEvent.Request.Any
    | MessengerServiceEventModel.OutcomingEvent.Response.Any
    | MessengerServiceEventModel.IncomingEvent.Any;

class MessengerServiceUnspecifiedEvent<E extends AnyEvent> {
    public readonly name: MessengerServiceEventModel.AnyEventName;
    public readonly userID: string;
    public readonly payload: E["payload"]; // TODO fix typesation for payload, now doesn't work like should

    public JSON() {
        return JSON.stringify(this);
    }

    constructor(userID: string, MessengerServiceEvent: E) {
        this.userID = userID;
        this.name = MessengerServiceEvent.name;
        this.payload = MessengerServiceEvent.payload;
    }
}

export class MessengerServiceOutcomingEventRequest<
    E extends MessengerServiceEventModel.OutcomingEvent.Request.Any = MessengerServiceEventModel.OutcomingEvent.Request.Any
> extends MessengerServiceUnspecifiedEvent<E> {
    public readonly type = "request";
    public accessToken = LocalStorageController.accessToken.get();
}

export class MessengerServiceOutcomingEventResponse<
    E extends MessengerServiceEventModel.OutcomingEvent.Response.Any = MessengerServiceEventModel.OutcomingEvent.Response.Any
> extends MessengerServiceUnspecifiedEvent<E> {
    public readonly type = "response";
}

export class MessengerServiceIncomingEvent<
    E extends MessengerServiceEventModel.IncomingEvent.Any = MessengerServiceEventModel.IncomingEvent.Any
> extends MessengerServiceUnspecifiedEvent<E> {}
