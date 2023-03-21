import React from "react";

import type MessangerService from "../../types/shared/model/hooks/useMessangerService";

import { useTypedSelector } from "./useTypedSelector";
import MessangerServiceURL from "../../lib/URL/MessangerServiceURL";
import LocalStorageController from "../../lib/LocalStorageController";
import { addRefresh } from "../../../entities/User";
import { useTypedDispatch } from "./useTypedDispatch";

interface ParsedMessage {
    code: number;
    message: string;
}

export default function useMessangerService() {
    const { user } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();
    const wsConnectionRef = React.useRef<WebSocket | null>(null);
    const lastEventRef = React.useRef<MessangerService.Event.Any | null>(null);

    if (!(wsConnectionRef.current instanceof WebSocket)) {
        establishConnection();
    }

    function wsSend(ws: WebSocket, event: MessangerService.Event.Any) {
        const requestPayload = {
            accessToken: LocalStorageController.accessToken.get(),
            userID: user!.id,
            chatID: event.chatID,
            event: event.event,
            payload: event.payload,
        };

        if (ws.readyState) {
            ws.send(JSON.stringify(requestPayload));
            return;
        }

        setTimeout(() => wsSend(ws, event), 50);
    }

    function establishConnection() {
        if (wsConnectionRef.current instanceof WebSocket) {
            console.warn("Connection already established");
            return;
        }

        wsConnectionRef.current = new WebSocket(MessangerServiceURL);

        // wsConnectionRef.current.onopen = function () {
        //     console.log("Messanger Service connection established.");
        // };

        wsConnectionRef.current.onclose = function (event) {
            if (event.wasClean) {
                console.log("Соединение закрыто чисто");
            } else {
                console.log("Обрыв соединения");
            }
            console.log("Код: " + event.code + " причина: " + event.reason);
        };

        wsConnectionRef.current.onerror = function (error) {
            console.error(error);
        };

        wsConnectionRef.current.onmessage = async function (ev) {
            const wsConnection = wsConnectionRef.current!;

            const parsedMessage: ParsedMessage = JSON.parse(ev.data);

            if (parsedMessage.code === 401) {
                console.log("Messanger service request error: Access token expired. Updating...");

                await dispatch(addRefresh());

                wsSend(wsConnection, lastEventRef.current!);

                return;
            }

            // TODO add hendlers here

            console.log(`Messanger Service:\n${JSON.stringify(parsedMessage.message)}`);
        };
    }

    function dispathMessangerServiceEvent(connectionEvent: MessangerService.Event.Any) {
        const wsConnection = wsConnectionRef.current;

        if (!wsConnection) {
            throw new Error(`Messanger Serivce connection isn't established`);
        }

        switch (connectionEvent.event) {
            case "send-message":
                const sendMessageEvent: MessangerService.Event.SendMessage = {
                    chatID: connectionEvent.chatID,
                    event: "send-message",
                    payload: connectionEvent.payload,
                };

                lastEventRef.current = sendMessageEvent;

                wsSend(wsConnection, sendMessageEvent);

                break;
            case "delete-message":
                throw new Error("Not implemented");
            case "edite-message":
                throw new Error("Not implemented");
            case "update-message-read-status":
                throw new Error("Not implemented");
            default:
                throw new Error("Wrong event type");
        }
    }

    function closeConnection() {
        const wsConnection = wsConnectionRef.current;

        if (!(wsConnection instanceof WebSocket)) {
            console.warn("Messanger Service connection closing error: connection wasn't established");
            return;
        }

        wsConnection.close();
        wsConnectionRef.current = null;
    }

    return { dispathMessangerServiceEvent, closeConnection, wsConnectionRef };
}
