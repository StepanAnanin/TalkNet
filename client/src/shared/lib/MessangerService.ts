import User from "../types/entities/User";
import type IMessangerService from "../types/shared/lib/MessangerService";
import { MessangerServiceOutcomingEvent } from "./MessangerServiceEvent";

export default class MessangerService extends WebSocket {
    protected user: User;

    protected lastOutcomingEvent: MessangerServiceOutcomingEvent | null = null;

    protected lastOutcomingEventRepeatCounter = 0;

    constructor(url: string | URL, user: User, protocols?: string | string[]) {
        super(url, protocols);

        this.user = user;
    }

    public repeatLastOutcomingEvent(maxRepeats: number = 1) {
        const lastOutcomingEvent = this.lastOutcomingEvent;

        if (!lastOutcomingEvent) {
            console.warn(`There are no previous outcoming events`);
            return;
        }

        this.lastOutcomingEventRepeatCounter++;

        if (this.lastOutcomingEventRepeatCounter >= maxRepeats) {
            console.log("Repeat limit exceeded");
            return;
        }

        if (this.readyState) {
            // this.repeatLastOutcomingEvent();
            this.send(lastOutcomingEvent.JSON());

            return;
        }

        setTimeout(() => this.repeatLastOutcomingEvent(), 50);
    }

    protected async wsSend(event: IMessangerService.OutcomingEvent.Any) {
        const outcomingEvent = new MessangerServiceOutcomingEvent(this.user!.id, event);

        // console.log(outcomingEvent);

        if (this.readyState) {
            this.send(outcomingEvent.JSON());
            this.lastOutcomingEvent = outcomingEvent;
        } else {
            setTimeout(() => this.wsSend(event), 50);
        }
    }

    public async sendMessage(sendMessageEvent: IMessangerService.OutcomingEvent.SendMessage) {
        const sentDate = Date.now();

        this.wsSend(sendMessageEvent);
    }
}
