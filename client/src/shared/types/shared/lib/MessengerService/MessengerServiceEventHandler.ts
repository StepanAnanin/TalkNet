import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../lib/MessengerService/MessengerServiceEvent";
import MessengerServiceEventModel from "./MessengerServiceModel";

export interface MessengerServiceIncomingEventHandler {
    event: MessengerServiceEventModel.IncomingEventName;
    handler: (e: MessengerServiceIncomingEvent) => void;
}

export interface MessengerServiceOutcomingEventHandler {
    event: MessengerServiceEventModel.OutcomingEventName;
    handler: (e: MessengerServiceOutcomingEventResponse) => void;
}

export interface MessengerServiceAnyEventHandler {
    event: MessengerServiceIncomingEventHandler["event"] | MessengerServiceOutcomingEventHandler["event"];
    handler: MessengerServiceIncomingEventHandler["handler"] | MessengerServiceOutcomingEventHandler["handler"];
}
