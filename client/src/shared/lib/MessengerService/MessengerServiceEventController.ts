import { io } from "socket.io-client";
import {
    MessengerServiceAnyEventHandler,
    MessengerServiceIncomingEventHandler,
    MessengerServiceOutcomingEventHandler,
} from "../../types/shared/lib/MessengerService/MessengerServiceEventHandler";
import MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";
import { MessengerServiceIncomingEvent, MessengerServiceOutcomingEventResponse } from "./MessengerServiceEvent";
import User from "../../types/entities/User";

/**
 * This class mustn't be used directly in react components.
 */
// This class mustn't be export directly, export this class instance instead.
export default class MessengerServiceEventController {
    public static readonly IncomingEventsMap: readonly MessengerServiceEventModel.IncomingEventName[] = [
        "receive-message",
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
        "access-denied",
    ] as const;

    public static readonly OutcomingEventsMap: readonly MessengerServiceEventModel.OutcomingEventName[] = [
        // "delete-message", // not implemented
        // "edite-message", // not implemented
        "establish-connection",
        "connect-to-chats",
        "send-message",
        "update-message-read-date",
    ] as const;

    public static readonly EventsMap: readonly MessengerServiceEventModel.AnyEventName[] = [
        ...this.IncomingEventsMap,
        ...this.OutcomingEventsMap,
    ] as const;

    protected readonly socket: ReturnType<typeof io>;
    protected readonly user: User;

    /*
        There are two arrays for event handlers cuz outcoming events have request and response,
        but incoming events have only response cuz they are dispatched only by messenger service.
        (for example when user get message from interlocutor)
    */
    protected incomingEventHandlers: MessengerServiceIncomingEventHandler[] = [];
    protected outcomingEventHandlers: MessengerServiceOutcomingEventHandler[] = [];

    constructor(user: User, socket: ReturnType<typeof io>) {
        this.socket = socket;
        this.user = user;

        this.socket.onAny((en, stringifiedEvent) => {
            const parsedEvent = JSON.parse(stringifiedEvent) as MessengerServiceEventModel.AnyEvent;
            const eventName = parsedEvent.name;

            if (!this.isEventHandled(eventName)) {
                return;
            }

            // Handling incoming events;
            if (parsedEvent.type === "incoming") {
                const formatedEvent = new MessengerServiceIncomingEvent(this.user.id, parsedEvent);

                for (const eventHandler of this.incomingEventHandlers) {
                    if (eventName === eventHandler.event) {
                        eventHandler.handler(formatedEvent);
                    }
                }

                return;
            }

            // Handling responses on outcoming events;
            if (parsedEvent.type === "outcoming" && parsedEvent.severity === "response") {
                const formatedEvent = new MessengerServiceOutcomingEventResponse(this.user.id, parsedEvent);

                for (const eventHandler of this.outcomingEventHandlers) {
                    if (eventName === eventHandler.event) {
                        eventHandler.handler(formatedEvent);
                    }
                }

                return;
            }

            console.warn(`[Messenger Service] Received incorrect event type: ${parsedEvent.type}`);
        });
    }

    protected getEventHandlerIndex = (
        event: MessengerServiceAnyEventHandler["event"],
        handlers: MessengerServiceIncomingEventHandler[] | MessengerServiceOutcomingEventHandler[],
        handler: MessengerServiceAnyEventHandler["handler"]
    ) => {
        let handlerIndex: number = -1;

        // Cannot use '.indexOf' or '.includes' cuz it's array of objects;
        for (let i = 0; i < handlers.length; i++) {
            const eventHandler = handlers[i];

            if (eventHandler.event === event && eventHandler.handler === handler) {
                handlerIndex = i;
                break;
            }
        }

        return handlerIndex;
    };

    protected isEventHandled(e: MessengerServiceAnyEventHandler["event"]) {
        if (this.incomingEventHandlers.find((eventHandler) => eventHandler.event === e)) {
            return true;
        }

        if (this.outcomingEventHandlers.find((eventHandler) => eventHandler.event === e)) {
            return true;
        }

        return false;
    }

    // TODO there are some problems with typesation, but fuck it. I'm tierd of fighting with this...
    public addEventHandler = (
        event: MessengerServiceAnyEventHandler["event"],
        handler: MessengerServiceAnyEventHandler["handler"]
    ) => {
        if (MessengerServiceEventController.OutcomingEventsMap.includes(event as any)) {
            // If this event handler is already exist, then there are no point to add it again.
            if (this.outcomingEventHandlers.includes({ event: event as any, handler })) {
                return;
            }

            this.outcomingEventHandlers.push({ event: event as any, handler });
            return;
        }

        if (MessengerServiceEventController.IncomingEventsMap.includes(event as any)) {
            // If this event handler is already exist, then there are no point to add it again.
            if (this.incomingEventHandlers.includes({ event: event as any, handler: handler as any })) {
                return;
            }

            this.incomingEventHandlers.push({ event: event as any, handler: handler as any });
            return;
        }

        throw new TypeError(`Event ${event} doesn't exist`);
    };

    public removeEventHandler = (
        event: MessengerServiceAnyEventHandler["event"],
        handler: MessengerServiceAnyEventHandler["handler"]
    ) => {
        if (MessengerServiceEventController.OutcomingEventsMap.includes(event as any)) {
            const targetedEventHandlerIndex = this.getEventHandlerIndex(event, this.outcomingEventHandlers, handler);

            if (targetedEventHandlerIndex === -1) {
                console.warn("Targeted event handler wasn't found");
                return;
            }

            this.outcomingEventHandlers.splice(targetedEventHandlerIndex, 1);
            return;
        }

        if (MessengerServiceEventController.IncomingEventsMap.includes(event as any)) {
            const targetedEventHandlerIndex = this.getEventHandlerIndex(event, this.incomingEventHandlers, handler);

            if (targetedEventHandlerIndex === -1) {
                console.warn("Targeted event handler wasn't found");
                return;
            }

            this.incomingEventHandlers.splice(targetedEventHandlerIndex, 1);
            return;
        }

        throw new TypeError(`Event ${event} doesn't exist`);
    };
}
