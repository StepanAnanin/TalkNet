import React from "react";
import { io } from "socket.io-client";

import type MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";

import { useTypedSelector } from "./useTypedSelector";
import MessengerServiceURL from "../../lib/URL/MessengerServiceURL";
import MessengerServiceEventEmitter from "../../lib/MessengerService/MessengerServiceEventEmitter";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../lib/MessengerService/MessengerServiceEvent";
import { useAuthControl } from "../../../features/Auth";
import MSEventController from "../../lib/MessengerService/MessengerServiceEventController";

type ConnectionEventMainData = Omit<Omit<MessengerServiceEventModel.OutcomingEvent.Request.Any, "type">, "severity">;

/*
 * If move it inside of hook, then connection will be closed and open on each call of useMessengerService,
 * this will ruin intended behavior of this hook
 *
 * IMPORTANT:
 * EventEmitter automatically close connection before window unload.
 * (see MessengerServiceEventEmitter's constructor for details)
 */
let MSEventEmitter: MessengerServiceEventEmitter | null = null;

/**
 * This hook automatically controls connection state with `Messenger Service`.
 *
 * @returns `MessengerServiceConnection` object
 *
 * All error events are logged in console by default.
 */
// BUG If open some chat, than go to the any other page and go back to chat, then outcoming event handlers will not be called...
export default function useMessengerService() {
    const { payload: user } = useTypedSelector((state) => state.auth);
    const { refreshAuth } = useAuthControl();

    const [lastHandledIncomingEvent, setLastHandledIncomingEvent] =
        React.useState<MessengerServiceIncomingEvent | null>(null);

    const [lastHandledOutcomingEvent, setLastHandledOutcomingEvent] =
        React.useState<MessengerServiceOutcomingEventResponse | null>(null);

    const [error, setError] = React.useState<string | null>(null);

    if (!user) {
        throw new Error(`[Messenger Service] Authorization required`);
    }

    // I can't just throw error from socket.io event handler, so this is only way to do that... (cuz more likely it's wrapped in try catch and prevents any error from bubbling)
    // (By the way most bugged shit so far, it's literally ruins app's architecture in some cases and force me to do that shit below, i must add an additional state and useEffect...)
    // Need to try get rid of it, but i'm not sure how...
    React.useEffect(() => {
        if (!error) {
            return;
        }

        // ErrorBoundary will catch this
        throw new Error(error);
    }, [error]);

    if (!(MSEventEmitter instanceof MessengerServiceEventEmitter)) {
        establishConnection();
    }

    function establishConnection() {
        if (MSEventEmitter instanceof MessengerServiceEventEmitter) {
            console.warn("[Messenger Service] Connection already established");
            return;
        }

        const socket = io(MessengerServiceURL);

        MSEventEmitter = new MessengerServiceEventEmitter(user!, socket);

        addSocketIncomingEventHandlers(socket);
        addSocketOutcomingEventHandlers(socket);
    }

    function updateLastIncomingEvent(e: MessengerServiceIncomingEvent) {
        // If event isn't handled there are no point to update state, it will cause an excess re-render.
        if (!MSEventController.isEventHandled(e.name)) {
            return;
        }

        setLastHandledIncomingEvent(e);
    }

    function addSocketIncomingEventHandlers(socket: ReturnType<typeof io>) {
        if (!(MSEventEmitter instanceof MessengerServiceEventEmitter)) {
            throw new Error("Messenger Service connection is missing");
        }

        socket.on("receive-message", (e) => {
            updateLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, JSON.parse(e)));
        });

        socket.on("access-denied", (e) => {
            // See comment above first useEffect in this hook
            setError(`Доступ запрещён`);
        });

        socket.on("access-token-expired", async (e) => {
            console.log("[Messenger Service] Request error: Access token expired. Updating...");

            await refreshAuth();

            MSEventEmitter!.repeatLastOutcomingEventRequest();
        });

        socket.on("invalid-request", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Invalid request:");
            console.error(parsedEvent);

            updateLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });

        socket.on("validation-error", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Validation error:");
            console.error(parsedEvent);

            updateLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });

        socket.on("unexpected-error", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Unexpected error:");
            console.error(parsedEvent);

            updateLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });
    }

    function addSocketOutcomingEventHandlers(socket: ReturnType<typeof io>) {
        // Outcoming events handled not there, so just need to update lastOutcomingEvent
        socket.onAny((eventName, stringifiedEvent) => {
            const parsedEvent = JSON.parse(stringifiedEvent);

            // If event isn't outcoming
            if (!MSEventController.OutcomingEventsMap.includes(parsedEvent.name)) {
                return;
            }

            const event = new MessengerServiceOutcomingEventResponse(user!.id, parsedEvent);

            // If event isn't handled there are no point to update state, it will cause an excess re-render.
            if (!MSEventController.isEventHandled(event.name)) {
                return;
            }

            setLastHandledOutcomingEvent(event);
        });
    }

    function dispathOutcomingEvent(ConnectionEvent: ConnectionEventMainData) {
        if (!(MSEventEmitter instanceof MessengerServiceEventEmitter)) {
            throw new Error(`[Messenger Service] Failed to dispatch outcoming event: Connection isn't established`);
        }

        if (!MSEventController.OutcomingEventsMap.includes(ConnectionEvent.name)) {
            throw new TypeError("[Messenger Service] Failed to dispatch outcoming event: Wrong event name");
        }

        MSEventEmitter.emitOutcomingEventRequest(createOutcomingEventRequest(ConnectionEvent.name, ConnectionEvent.payload));
    }

    // TODO There are a problem with typesation of return object.
    function createOutcomingEventRequest(
        name: MessengerServiceEventModel.OutcomingEvent.Request.Any["name"],
        payload: MessengerServiceEventModel.OutcomingEvent.Request.Any["payload"]
    ) {
        return {
            type: "outcoming",
            severity: "request",
            name,
            payload,
        } as any;
    }

    // TODO unite below useEffects

    // Tracking and handling incoming events
    React.useEffect(() => {
        if (!lastHandledIncomingEvent) {
            return;
        }

        for (const eventHandler of MSEventController.incomingEventHandlers) {
            if (lastHandledIncomingEvent.name === eventHandler.event) {
                eventHandler.handler(lastHandledIncomingEvent);
            }
        }
    }, [lastHandledIncomingEvent]);

    // Tracking and handling outcoming events
    React.useEffect(() => {
        if (!lastHandledOutcomingEvent) {
            return;
        }

        for (const eventHandler of MSEventController.outcomingEventHandlers) {
            if (lastHandledOutcomingEvent.name === eventHandler.event) {
                eventHandler.handler(lastHandledOutcomingEvent);
            }
        }
    }, [lastHandledOutcomingEvent]);

    return {
        dispathOutcomingEvent,

        // TODO try to solve problem decribed below.
        // (This will remove excess renders for components wich use only functions below)

        // If use this methods directly from "MSEventController", then it won't work,
        // cuz logic of tracking and handling events are located inside of this hook.
        addEventHandler: MSEventController.addEventHandler,
        removeEventHandler: MSEventController.removeEventHandler,
    };
}
