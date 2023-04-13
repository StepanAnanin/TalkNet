import { event } from "../types/WebSocket/Events";

export default class MessengerServiceResponse<P extends object> {
    public readonly code: number;
    public readonly event: event;
    public readonly type = "response"; // TODO Remove this
    public readonly payload: P;

    public JSON() {
        return JSON.stringify(this);
    }

    constructor(code: number, event: event, payload: P) {
        this.code = code;
        this.event = event;
        this.payload = payload;
    }
}
