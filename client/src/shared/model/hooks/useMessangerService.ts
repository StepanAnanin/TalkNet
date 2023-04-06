import { io } from "socket.io-client";
import React from "react";

import type IMessangerService from "../../types/shared/lib/MessangerService";

import { useTypedSelector } from "./useTypedSelector";
import MessangerServiceURL from "../../lib/URL/MessangerServiceURL";
import { addRefresh } from "../../../entities/User";
import { useTypedDispatch } from "./useTypedDispatch";
import MessangerService from "../../lib/MessangerService";
import { MessangerServiceIncomingEvent, MessangerServiceOutcomingEvent } from "../../lib/MessangerServiceEvent";

/**
 * @returns `MessangerServiceConnection` object
 *
 * All error events are logged in console by default.
 */
export default function useMessangerService() {
    const { user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

    // TODO Now on each event will occur render, regardless is it handled or not.
    // Try to do something with this, not sure is it possible or not, cuz useEffect won't work without rerender;
    const [lastIncomingEvent, setLastIncomingEvent] = React.useState<MessangerServiceIncomingEvent | null>(null);
    const [lastOutcomingEvent, setLastOutcomingEvent] = React.useState<MessangerServiceOutcomingEvent | null>(null);

    const MessangerServiceConnectionRef = React.useRef<MessangerService | null>(null);
    const lastEventRef = React.useRef<IMessangerService.OutcomingEvent.Any | null>(null);

    if (!user) {
        throw new Error(`Messanger service connection require authorization`);
    }

    if (!(MessangerServiceConnectionRef.current instanceof MessangerService)) {
        establishConnection();
    }

    function establishConnection() {
        if (MessangerServiceConnectionRef.current instanceof MessangerService) {
            console.warn("[Messender Service] Connection already established");
            return;
        }

        const socket = io(MessangerServiceURL);

        socket.on("message", async function (rawEvent: string) {
            const messangerServiceConnection = MessangerServiceConnectionRef.current!;

            const parsedEvent: IMessangerService.AnyEvent = JSON.parse(rawEvent);

            // Handling incoming errors
            switch (parsedEvent.event) {
                case "access-token-expired":
                    console.log("[Messenger Service] Request error: Access token expired. Updating...");

                    await dispatch(addRefresh());

                    messangerServiceConnection.repeatLastOutcomingEvent();

                    return;
                case "invalid-request":
                    console.error("[Messenger Service] Invalid request:");
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;
                case "validation-error":
                    console.error("[Messenger Service] Validation error:");
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;

                case "unexpected-error":
                    console.error("[Messenger Service] Unexpected error:");
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;
                default:
                    break;
            }

            // TODO temp solution, see TODO in IMessangerService. Remove it when it will be done.
            // Without this response on 'send-message' event's property chatID will be undefined.
            if (!parsedEvent.chatID) {
                // @ts-ignore
                if (parsedEvent.payload.chatID) {
                    // @ts-ignore
                    parsedEvent.chatID = parsedEvent.payload.chatID;
                }
            }

            // This is response
            setLastOutcomingEvent(new MessangerServiceOutcomingEvent(user!.id, parsedEvent));
        });

        MessangerServiceConnectionRef.current = new MessangerService(user!, socket);
    }

    function dispathOutcomingEvent(connectionEvent: IMessangerService.OutcomingEvent.Any) {
        const MessangerServiceConnection = MessangerServiceConnectionRef.current;

        if (!MessangerServiceConnection) {
            throw new Error(`Messanger Serivce connection isn't established`);
        }

        switch (connectionEvent.event) {
            case "send-message":
                const sendMessageEvent: IMessangerService.OutcomingEvent.SendMessage = {
                    chatID: connectionEvent.chatID,
                    event: "send-message",
                    payload: connectionEvent.payload,
                };

                lastEventRef.current = sendMessageEvent;

                MessangerServiceConnection.sendMessage(sendMessageEvent);

                break;
            case "delete-message":
                throw new Error("Not implemented");
            case "edite-message":
                throw new Error("Not implemented");
            case "update-message-read-date":
                throw new Error("Not implemented");
            case "get-chat-messages":
                const getChatMessagesEvent: IMessangerService.OutcomingEvent.GetChatMessages = {
                    chatID: connectionEvent.chatID,
                    event: "get-chat-messages",
                    payload: connectionEvent.payload,
                };

                lastEventRef.current = getChatMessagesEvent;

                MessangerServiceConnection.getChatMessages(getChatMessagesEvent);

                break;
            default:
                throw new Error("Wrong event type");
        }
    }

    function closeConnection() {
        const MessangerServiceConnection = MessangerServiceConnectionRef.current;

        if (!(MessangerServiceConnection instanceof MessangerService)) {
            console.warn("[Messenger Service] Connection closing error: connection wasn't established");
            return;
        }

        MessangerServiceConnection.close();
        MessangerServiceConnectionRef.current = null;
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
        connectionRef: MessangerServiceConnectionRef,
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
 * but incoming events have only response cuz they are dispatched only by messanger service.
 * (for example when user get message from interlocutor)
 */

interface IncomingEventHandler {
    event: IMessangerService.IncomingEventName;
    handler: (e: MessangerServiceIncomingEvent) => void;
}

interface OutcomingEventHandler {
    event: IMessangerService.OutcomingEventName;
    handler: (e: MessangerServiceOutcomingEvent) => void;
}

const incomingEventHandlers: IncomingEventHandler[] = [];
const outcomingEventHandlers: OutcomingEventHandler[] = [];

function addOutcomingEventHandler(
    event: IMessangerService.OutcomingEventName,
    handler: (e: MessangerServiceOutcomingEvent) => void
) {
    if (!MessangerService.outcomingEventMap.includes(event)) {
        throw new TypeError(`Event must be OutcomingEvent`);
    }

    outcomingEventHandlers.push({ event, handler });
}

function addIncomingEventHandler(
    event: IMessangerService.IncomingEventName,
    handler: (e: MessangerServiceIncomingEvent) => void
) {
    if (!MessangerService.incomingEventMap.includes(event)) {
        throw new TypeError(`Event must be IncomingEvent`);
    }

    incomingEventHandlers.push({ event, handler });
}

function removeOutcomingEventHandler(
    event: IMessangerService.OutcomingEventName,
    handler: (e: MessangerServiceOutcomingEvent) => void
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
    event: IMessangerService.IncomingEventName,
    handler: (e: MessangerServiceIncomingEvent) => void
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
