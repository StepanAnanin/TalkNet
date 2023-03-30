import React from "react";

import type IMessangerService from "../../types/shared/lib/MessangerService";

import { useTypedSelector } from "./useTypedSelector";
import MessangerServiceURL from "../../lib/URL/MessangerServiceURL";
import { addRefresh } from "../../../entities/User";
import { useTypedDispatch } from "./useTypedDispatch";
import MessangerService from "../../lib/MessangerService";
import { MessangerServiceIncomingEvent, MessangerServiceOutcomingEvent } from "../../lib/MessangerServiceEvent";

interface IncomingEventHandler {
    event: IMessangerService.IncomingEventName;
    handler: (e: MessangerServiceIncomingEvent) => void;
}

interface OutcomingEventHandler {
    event: IMessangerService.OutcomingEventName;
    handler: (e: MessangerServiceOutcomingEvent) => void;
}

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
            console.warn("Connection already established");
            return;
        }

        MessangerServiceConnectionRef.current = new MessangerService(MessangerServiceURL, user!);

        MessangerServiceConnectionRef.current.onmessage = async function (ev) {
            const messangerServiceConnection = MessangerServiceConnectionRef.current!;

            const parsedEvent: IMessangerService.AnyEvent = JSON.parse(ev.data);

            // Handling incoming errors
            switch (parsedEvent.event) {
                case "access-token-expired":
                    console.log("Messanger service request error: Access token expired. Updating...");

                    await dispatch(addRefresh());

                    messangerServiceConnection.repeatLastOutcomingEvent();

                    return;
                case "invalid-request":
                    console.error(`Messanger Service invalid request:`);
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;
                case "validation-error":
                    console.error("Messanger Service validation error:");
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;

                case "unexpected-error":
                    console.error("Messanger Service unexpected error:");
                    console.error(parsedEvent);

                    setLastIncomingEvent(new MessangerServiceIncomingEvent(user!.id, parsedEvent));
                    return;
                default:
                    break;
            }

            setLastOutcomingEvent(new MessangerServiceOutcomingEvent(user!.id, parsedEvent));
        };
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
            console.warn("Messanger Service connection closing error: connection wasn't established");
            return;
        }

        MessangerServiceConnection.close();
        MessangerServiceConnectionRef.current = null;
    }

    // ========================================= Events Handling =========================================
    // TODO Argument "e" on event handlers has problems with typesation, fix it.

    /**
     * There are two arrays for event handlers cuz outcoming events have request and response,
     * but incoming events have only response cuz they are dispatched only by messanger service.
     * (for example when user get message from interlocutor)
     */

    const incomingEventHandlers = React.useRef<IncomingEventHandler[]>([]);
    const outcomingEventHandlers = React.useRef<OutcomingEventHandler[]>([]);

    function addOutcomingEventHandler(
        event: IMessangerService.OutcomingEventName,
        handler: (e: MessangerServiceOutcomingEvent) => void
    ) {
        if (!MessangerService.outcomingEventMap.includes(event)) {
            throw new TypeError(`Event must be OutcomingEvent`);
        }

        outcomingEventHandlers.current.push({ event, handler });
    }

    function addIncomingEventHandler(
        event: IMessangerService.IncomingEventName,
        handler: (e: MessangerServiceIncomingEvent) => void
    ) {
        if (!MessangerService.incomingEventMap.includes(event)) {
            throw new TypeError(`Event must be IncomingEvent`);
        }

        incomingEventHandlers.current.push({ event, handler });
    }

    function removeOutcomingEventHandler(
        event: IMessangerService.OutcomingEventName,
        handler: (e: MessangerServiceOutcomingEvent) => void
    ) {
        let handlerIndex: number = -1;

        // Cannot use '.indexOf' or '.includes' cuz it's array of objects;
        for (let i = 0; i < outcomingEventHandlers.current.length; i++) {
            const eventHandler = outcomingEventHandlers.current[i];

            if (eventHandler.event === event && eventHandler.handler === handler) {
                handlerIndex = i;
                break;
            }
        }

        if (handlerIndex === -1) {
            return;
        }

        outcomingEventHandlers.current.splice(handlerIndex, 1);
    }

    function removeIncomingEventHandler(
        event: IMessangerService.IncomingEventName,
        handler: (e: MessangerServiceIncomingEvent) => void
    ) {
        let handlerIndex: number = -1;

        // Cannot use '.indexOf' or '.includes' cuz it's array of objects;
        for (let i = 0; i < incomingEventHandlers.current.length; i++) {
            const eventHandler = incomingEventHandlers.current[i];

            if (eventHandler.event === event && eventHandler.handler === handler) {
                handlerIndex = i;
                break;
            }
        }

        if (handlerIndex === -1) {
            return;
        }

        incomingEventHandlers.current.splice(handlerIndex, 1);
    }

    // Handling incoming event
    React.useEffect(() => {
        if (!lastIncomingEvent) {
            return;
        }

        for (const eventHandler of incomingEventHandlers.current) {
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

        for (const eventHandler of outcomingEventHandlers.current) {
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
