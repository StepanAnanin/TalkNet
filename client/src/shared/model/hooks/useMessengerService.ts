import React from "react";
import { io } from "socket.io-client";

import type MessengerServiceEventModel from "../../types/shared/lib/MessengerService/MessengerServiceModel";

import { useTypedSelector } from "./useTypedSelector";
import MessengerServiceURL from "../../lib/URL/MessengerServiceURL";
import MessengerServiceEventEmitter from "../../lib/MessengerService/MessengerServiceEventEmitter";
import { useAuthControl } from "../../../features/Auth";
import MessengerServiceEventController from "../../lib/MessengerService/MessengerServiceEventController";

type ConnectionEventMainData = Omit<Omit<MessengerServiceEventModel.OutcomingEvent.Request.Any, "type">, "severity">;

/*
 * If move it inside of hook, then connection will be closed and open on each call of useMessengerService,
 * this will ruin intended behavior of this hook.
 *
 * IMPORTANT:
 * EventEmitter automatically close connection before window unload.
 * (see MessengerServiceEventEmitter's constructor for details)
 */
let MSEventEmitter: MessengerServiceEventEmitter | null = null;
let MSEventController: MessengerServiceEventController | null = null;

/**
 * This hook automatically controls connection state with `Messenger Service`.
 *
 * @returns `MessengerServiceConnection` object
 */
export default function useMessengerService() {
    const { payload: user } = useTypedSelector((state) => state.auth);
    const { refreshAuth } = useAuthControl();

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
        MSEventController = new MessengerServiceEventController(user!, socket);

        socket.on("access-denied", (e) => {
            // See comment above first useEffect in this hook
            setError(`Доступ запрещён`);
        });

        socket.on("access-token-expired", async (e) => {
            console.log("[Messenger Service] Request error: Access token expired. Updating...");

            await refreshAuth();

            MSEventEmitter!.repeatLastOutcomingEventRequest();
        });
    }

    function dispathOutcomingEvent(ConnectionEvent: ConnectionEventMainData) {
        if (!(MSEventEmitter instanceof MessengerServiceEventEmitter)) {
            throw new Error(`[Messenger Service] Failed to dispatch outcoming event: Connection isn't established`);
        }

        if (!MessengerServiceEventController.OutcomingEventsMap.includes(ConnectionEvent.name)) {
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

    return {
        dispathOutcomingEvent,
        addEventHandler: MSEventController!.addEventHandler,
        removeEventHandler: MSEventController!.removeEventHandler,
    };
}
