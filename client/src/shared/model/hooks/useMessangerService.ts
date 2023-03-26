import React from "react";

import type IMessangerService from "../../types/shared/lib/MessangerService";

import { useTypedSelector } from "./useTypedSelector";
import MessangerServiceURL from "../../lib/URL/MessangerServiceURL";
import { addRefresh } from "../../../entities/User";
import { useTypedDispatch } from "./useTypedDispatch";
import MessangerService from "../../lib/MessangerService";
import { MessangerServiceIncomingEvent } from "../../lib/MessangerServiceEvent";

export default function useMessangerService() {
    const { user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

    const [incomingEvent, setIncomingEvent] = React.useState<MessangerServiceIncomingEvent | null>(null);
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

        MessangerServiceConnectionRef.current.onclose = function (event) {
            if (event.wasClean) {
                console.log("Соединение закрыто чисто");
            } else {
                console.log("Обрыв соединения");
            }
            console.log("Код: " + event.code + " причина: " + event.reason);
        };

        MessangerServiceConnectionRef.current.onerror = function (error) {
            console.error(error);
        };

        MessangerServiceConnectionRef.current.onmessage = async function (ev) {
            const messangerServiceConnection = MessangerServiceConnectionRef.current!;

            const parsedEvent: IMessangerService.IncomingEvent.Any = JSON.parse(ev.data);

            const incomingEvent = new MessangerServiceIncomingEvent(user!.id, parsedEvent);

            if (parsedEvent.code === 401) {
                console.log("Messanger service request error: Access token expired. Updating...");

                await dispatch(addRefresh());

                // messangerServiceConnection.wsSend(lastEventRef.current!);
                messangerServiceConnection.repeatLastOutcomingEvent();

                return;
            }

            // TODO add here handlers for incoming requests from server
            setIncomingEvent(incomingEvent);

            console.log(`Messanger Service:\n${JSON.stringify(parsedEvent)}`);
        };
    }

    function dispathMessangerServiceOutcomingEvent(connectionEvent: IMessangerService.OutcomingEvent.Any) {
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

    return {
        dispathMessangerServiceOutcomingEvent,
        closeConnection,
        MessangerServiceConnectionRef,
        incomingEventState: [incomingEvent, setIncomingEvent],
    };
}
