import type IMessangerService from "../types/shared/lib/MessangerService";
import LocalStorageController from "./LocalStorageController";

class MessangerServiceEvent<E extends IMessangerService.AnyEvent> {
    public readonly event: IMessangerService.AnyEventName;
    public readonly userID: string;
    public readonly chatID: string;
    public readonly payload: E["payload"]; // TODO fix typesation for payload, now doesn't work like should

    public JSON() {
        return JSON.stringify(this);
    }

    constructor(userID: string, messangerServiceEvent: E) {
        this.userID = userID;
        this.chatID = messangerServiceEvent.chatID;
        this.event = messangerServiceEvent.event;
        this.payload = messangerServiceEvent.payload;
    }
}

export class MessangerServiceOutcomingEvent<
    E extends IMessangerService.OutcomingEvent.Any = IMessangerService.OutcomingEvent.Any
> extends MessangerServiceEvent<E> {
    public accessToken = LocalStorageController.accessToken.get();
}

export class MessangerServiceIncomingEvent<
    E extends IMessangerService.IncomingEvent.Any = IMessangerService.IncomingEvent.Any
> extends MessangerServiceEvent<E> {}
