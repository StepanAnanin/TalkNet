import { io } from "socket.io-client";
import React from "react";

import type MessengerServiceModel from "../../types/shared/lib/MessengerServiceModel";

import { useTypedSelector } from "./useTypedSelector";
import MessengerServiceURL from "../../lib/URL/MessengerServiceURL";
import { addRefresh } from "../../../entities/User";
import { useTypedDispatch } from "./useTypedDispatch";
import MessengerService from "../../lib/MessengerService";
import { MessengerServiceIncomingEvent, MessengerServiceOutcomingEventResponse } from "../../lib/MessengerServiceEvent";

/**
 * If move it inside of hook, then connection will be closed and open on each call of useMessengerService,
 * this will ruin intended behavior of this hook
 */
const MessengerServiceConnectionRef: { current: MessengerService | null } = { current: null };

/**
 * @returns `MessengerServiceConnection` object
 *
 * All error events are logged in console by default.
 */
export default function useMessengerService() {
    const { user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

    // TODO Now on each event will occur render, regardless is it handled or not.
    // Try to do something with this, not sure is it possible or not, cuz useEffect won't work without rerender;
    const [lastIncomingEvent, setLastIncomingEvent] = React.useState<MessengerServiceIncomingEvent | null>(null);
    const [lastOutcomingEvent, setLastOutcomingEvent] = React.useState<MessengerServiceOutcomingEventResponse | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const lastEventRef = React.useRef<MessengerServiceModel.OutcomingEvent.Request.Any | null>(null);

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

    if (!user) {
        throw new Error(`[Messenger Service] Connection require authorization`);
    }

    if (!(MessengerServiceConnectionRef.current instanceof MessengerService)) {
        establishConnection();
    }

    function establishConnection() {
        if (MessengerServiceConnectionRef.current instanceof MessengerService) {
            console.warn("[Messenger Service] Connection already established");
            return;
        }

        const socket = io(MessengerServiceURL);

        MessengerServiceConnectionRef.current = new MessengerService(user!, socket);

        addSocketIncomingEventHandlers(socket);
        addSocketOutcomingEventHandlers(socket);
    }

    function addSocketIncomingEventHandlers(socket: ReturnType<typeof io>) {
        const MessengerServiceConnection = MessengerServiceConnectionRef.current;

        if (!(MessengerServiceConnection instanceof MessengerService)) {
            throw new Error("Messenger Service connection is missing");
        }

        socket.on("receive-message", (e) => {
            setLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, JSON.parse(e)));
        });

        socket.on("access-denied", (e) => {
            // See comment above first useEffect in this hook
            setError(`Доступ запрещён`);
        });

        socket.on("access-token-expired", async (e) => {
            console.log("[Messenger Service] Request error: Access token expired. Updating...");

            await dispatch(addRefresh());

            MessengerServiceConnection.repeatLastOutcomingEventRequest();
        });

        socket.on("invalid-request", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Invalid request:");
            console.error(parsedEvent);

            setLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });

        socket.on("validation-error", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Validation error:");
            console.error(parsedEvent);

            setLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });

        socket.on("unexpected-error", (e) => {
            const parsedEvent = JSON.parse(e);

            console.error("[Messenger Service] Unexpected error:");
            console.error(parsedEvent);

            setLastIncomingEvent(new MessengerServiceIncomingEvent(user!.id, parsedEvent));
        });
    }

    function addSocketOutcomingEventHandlers(socket: ReturnType<typeof io>) {
        // Outcoming events handled not there, so just need to update lastOutcomingEvent
        socket.onAny((eventName, event) => {
            const parsedEvent = JSON.parse(event);

            // If event isn't outcoming
            if (!MessengerService.OutcomingEventsMap.includes(parsedEvent.event)) {
                return;
            }

            setLastOutcomingEvent(new MessengerServiceOutcomingEventResponse(user!.id, parsedEvent));
        });
    }

    // There are some problem with typesation of payload, it's appears after i added Omit
    // TODO steel has problem with typesation of connectionEvent
    function dispathOutcomingEvent(ConnectionEvent: Omit<MessengerServiceModel.OutcomingEvent.Request.Any, "type">) {
        const MessengerServiceConnection = MessengerServiceConnectionRef.current;

        if (!MessengerServiceConnection) {
            throw new Error(`Messenger Serivce connection isn't established`);
        }

        switch (ConnectionEvent.event) {
            case "send-message":
                const sendMessageEvent: MessengerServiceModel.OutcomingEvent.Request.SendMessage = {
                    type: "request",
                    event: "send-message",
                    payload: ConnectionEvent.payload as any,
                };

                lastEventRef.current = sendMessageEvent;

                MessengerServiceConnection.sendMessage(sendMessageEvent);

                break;
            case "delete-message":
                throw new Error("Not implemented");
            case "edite-message":
                throw new Error("Not implemented");
            case "update-message-read-date":
                throw new Error("Not implemented");
            case "connect-to-chats":
                const connectToChatsEvent: MessengerServiceModel.OutcomingEvent.Request.ConnectToChats = {
                    type: "request",
                    event: "connect-to-chats",
                    payload: ConnectionEvent.payload as any,
                };

                lastEventRef.current = connectToChatsEvent;

                MessengerServiceConnection.connectToChats(connectToChatsEvent);

                break;
            case "get-chat-messages":
                const getChatMessagesEvent: MessengerServiceModel.OutcomingEvent.Request.GetChatMessages = {
                    type: "request",
                    event: "get-chat-messages",
                    payload: ConnectionEvent.payload as any,
                };

                lastEventRef.current = getChatMessagesEvent;

                MessengerServiceConnection.getChatMessages(getChatMessagesEvent);

                break;
            default:
                throw new Error("Wrong event type");
        }
    }

    function closeConnection() {
        const MessengerServiceConnection = MessengerServiceConnectionRef.current;

        if (!(MessengerServiceConnection instanceof MessengerService)) {
            console.warn("[Messenger Service] Connection closing error: connection wasn't established");
            return;
        }

        MessengerServiceConnection.close();
        MessengerServiceConnectionRef.current = null;
    }

    // Handling incoming event
    React.useEffect(() => {
        if (!lastIncomingEvent) {
            return;
        }

        for (const eventHandler of incomingEventHandlers) {
            if (lastIncomingEvent.event === eventHandler.event) {
                eventHandler.handler(lastIncomingEvent);
            }
        }
    }, [lastIncomingEvent]);

    // Handling outcoming event
    React.useEffect(() => {
        if (!lastOutcomingEvent) {
            return;
        }

        for (const eventHandler of outcomingEventHandlers) {
            if (lastOutcomingEvent.event === eventHandler.event) {
                eventHandler.handler(lastOutcomingEvent);
            }
        }
    }, [lastOutcomingEvent]);

    return {
        dispathOutcomingEvent,
        closeConnection,
        connectionRef: MessengerServiceConnectionRef,
        lastIncomingEvent,
        lastOutcomingEvent,
        addIncomingEventHandler,
        addOutcomingEventHandler,
        removeIncomingEventHandler,
        removeOutcomingEventHandler,
    };
}

// ========================================= Events Handling =========================================
// TODO Argument "e" on event handlers has problems with typesation, fix it.

/**
 * There are two arrays for event handlers cuz outcoming events have request and response,
 * but incoming events have only response cuz they are dispatched only by messenger service.
 * (for example when user get message from interlocutor)
 */

interface IncomingEventHandler {
    event: MessengerServiceModel.IncomingEventName;
    handler: (e: MessengerServiceIncomingEvent) => void;
}

interface OutcomingEventHandler {
    event: MessengerServiceModel.OutcomingEventName;
    handler: (e: MessengerServiceOutcomingEventResponse) => void;
}

const incomingEventHandlers: IncomingEventHandler[] = [];
const outcomingEventHandlers: OutcomingEventHandler[] = [];

function addOutcomingEventHandler(
    event: MessengerServiceModel.OutcomingEventName,
    handler: (e: MessengerServiceOutcomingEventResponse) => void
) {
    if (!MessengerService.OutcomingEventsMap.includes(event)) {
        throw new TypeError(`Event must be OutcomingEvent`);
    }

    outcomingEventHandlers.push({ event, handler });
}

function addIncomingEventHandler(
    event: MessengerServiceModel.IncomingEventName,
    handler: (e: MessengerServiceIncomingEvent) => void
) {
    if (!MessengerService.IncomingEventsMap.includes(event)) {
        throw new TypeError(`Event must be IncomingEvent`);
    }

    incomingEventHandlers.push({ event, handler });
}

function removeOutcomingEventHandler(
    event: MessengerServiceModel.OutcomingEventName,
    handler: (e: MessengerServiceOutcomingEventResponse) => void
) {
    let handlerIndex: number = -1;

    // Cannot use '.indexOf' or '.includes' cuz it's array of objects;
    for (let i = 0; i < outcomingEventHandlers.length; i++) {
        const eventHandler = outcomingEventHandlers[i];

        if (eventHandler.event === event && eventHandler.handler === handler) {
            handlerIndex = i;
            break;
        }
    }

    if (handlerIndex === -1) {
        return;
    }

    outcomingEventHandlers.splice(handlerIndex, 1);
}

function removeIncomingEventHandler(
    event: MessengerServiceModel.IncomingEventName,
    handler: (e: MessengerServiceIncomingEvent) => void
) {
    let handlerIndex: number = -1;

    // Cannot use '.indexOf' or '.includes' cuz it's array of objects;
    for (let i = 0; i < incomingEventHandlers.length; i++) {
        const eventHandler = incomingEventHandlers[i];

        if (eventHandler.event === event && eventHandler.handler === handler) {
            handlerIndex = i;
            break;
        }
    }

    if (handlerIndex === -1) {
        return;
    }

    incomingEventHandlers.splice(handlerIndex, 1);
}
