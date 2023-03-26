import type IMessangerService from "../types/shared/lib/MessangerService";
import LocalStorageController from "./LocalStorageController";

class MessangerServiceEvent<E extends IMessangerService.AnyEvent> {
    public readonly event: IMessangerService.AnyEventName;
    public readonly userID: string;
    public readonly chatID: string;
    public readonly payload: object;

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

export class MessangerServiceOutcomingEvent extends MessangerServiceEvent<IMessangerService.OutcomingEvent.Any> {
    public readonly accessToken = LocalStorageController.accessToken.get();
}

export class MessangerServiceIncomingEvent extends MessangerServiceEvent<IMessangerService.IncomingEvent.Any> {}
