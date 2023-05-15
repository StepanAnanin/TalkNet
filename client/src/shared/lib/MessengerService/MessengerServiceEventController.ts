import {
    MessengerServiceAnyEventHandler,
    MessengerServiceIncomingEventHandler,
    MessengerServiceOutcomingEventHandler,
} from "../../types/shared/lib/MessengerService/MessengerServiceEventHandler";
import MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";

/**
 * This class mustn't be used directly in react components.
 */
// This class mustn't be export directly, export this class instance instead.
class MessengerServiceEventController {
    public readonly IncomingEventsMap: readonly MessengerServiceEventModel.IncomingEventName[] = [
        "receive-message",
        "access-token-expired",
        "invalid-request",
        "unexpected-error",
        "validation-error",
        "access-denied",
    ] as const;

    public readonly OutcomingEventsMap: readonly MessengerServiceEventModel.OutcomingEventName[] = [
        // "delete-message", // not implemented
        // "edite-message", // not implemented
        "establish-connection",
        "connect-to-chats",
        "send-message",
        "update-message-read-date",
    ] as const;

    public readonly EventsMap: readonly MessengerServiceEventModel.AnyEventName[] = [
        ...this.IncomingEventsMap,
        ...this.OutcomingEventsMap,
    ] as const;

    /*
        There are two arrays for event handlers cuz outcoming events have request and response,
        but incoming events have only response cuz they are dispatched only by messenger service.
        (for example when user get message from interlocutor)
    */
    protected _incomingEventHandlers: MessengerServiceIncomingEventHandler[] = [];
    protected _outcomingEventHandlers: MessengerServiceOutcomingEventHandler[] = [];

    public get incomingEventHandlers() {
        return this._incomingEventHandlers;
    }
    public get outcomingEventHandlers() {
        return this._outcomingEventHandlers;
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

    // TODO there are some problems with typesation, but fuck it. I'm tierd of fighting with this...
    public addEventHandler = (
        event: MessengerServiceAnyEventHandler["event"],
        handler: MessengerServiceAnyEventHandler["handler"]
    ) => {
        if (this.OutcomingEventsMap.includes(event as any)) {
            // If this event handler is already exist, then there are no point to add it again.
            if (this._outcomingEventHandlers.includes({ event: event as any, handler })) {
                return;
            }

            this._outcomingEventHandlers.push({ event: event as any, handler });
            return;
        }

        if (this.IncomingEventsMap.includes(event as any)) {
            // If this event handler is already exist, then there are no point to add it again.
            if (this._incomingEventHandlers.includes({ event: event as any, handler: handler as any })) {
                return;
            }

            this._incomingEventHandlers.push({ event: event as any, handler: handler as any });
            return;
        }

        throw new TypeError(`Event ${event} doesn't exist`);
    };

    public removeEventHandler = (
        event: MessengerServiceAnyEventHandler["event"],
        handler: MessengerServiceAnyEventHandler["handler"]
    ) => {
        if (this.OutcomingEventsMap.includes(event as any)) {
            const targetedEventHandlerIndex = this.getEventHandlerIndex(event, this._outcomingEventHandlers, handler);

            if (targetedEventHandlerIndex === -1) {
                console.warn("Targeted event handler wasn't found");
                return;
            }

            this._outcomingEventHandlers.splice(targetedEventHandlerIndex, 1);
            return;
        }

        if (this.IncomingEventsMap.includes(event as any)) {
            const targetedEventHandlerIndex = this.getEventHandlerIndex(event, this._incomingEventHandlers, handler);

            if (targetedEventHandlerIndex === -1) {
                console.warn("Targeted event handler wasn't found");
                return;
            }

            this._incomingEventHandlers.splice(targetedEventHandlerIndex, 1);
            return;
        }

        throw new TypeError(`Event ${event} doesn't exist`);
    };

    public isEventHandled(e: MessengerServiceAnyEventHandler["event"]) {
        if (this._incomingEventHandlers.find((eventHandler) => eventHandler.event === e)) {
            return true;
        }

        if (this._outcomingEventHandlers.find((eventHandler) => eventHandler.event === e)) {
            return true;
        }

        return false;
    }
}

export default new MessengerServiceEventController();
