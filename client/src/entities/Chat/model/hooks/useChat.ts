import React from "react";

import type MessengerServiceModel from "../../../../shared/types/shared/lib/MessengerServiceModel";
import type DialogueChat from "../../../../shared/types/features/DialogueChat";

import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../shared/lib/MessengerServiceEvent";
import DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

export default function useChat() {
    const { user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error(`useChat hook require authorization`);
    }

    // This needed cuz userChats is enclosed, hence will have incorrect value in functions declared in this scope (like updateChatInfo).
    // This is a fucked way to fix that, but I didn’t come up with a better one.
    const userChatsRef = React.useRef<DialogueChat[] | null>(null);

    const [userChats, setUserChats] = React.useState<DialogueChat[] | null>(null);
    const [isChatsConnectionEstablised, setIsChatsConnectionEstablised] = React.useState(false);

    const MessengerServiceConnection = useMessengerService();

    // TODO check is there a point to close messenger service connection
    React.useEffect(() => {
        function updateMessageAmount(
            e:
                | MessengerServiceOutcomingEventResponse<MessengerServiceModel.OutcomingEvent.Response.Any>
                | MessengerServiceIncomingEvent<MessengerServiceModel.IncomingEvent.Any>
        ) {
            updateChatInfo((e.payload as any).chatID, e.payload as DialogueChatMessage);
        }

        function connectToChatsHandler(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceModel.OutcomingEvent.Response.Any>
        ) {
            setIsChatsConnectionEstablised(true);
        }

        MessengerServiceConnection.addOutcomingEventHandler("send-message", updateMessageAmount);
        MessengerServiceConnection.addOutcomingEventHandler("connect-to-chats", connectToChatsHandler);
        MessengerServiceConnection.addIncomingEventHandler("receive-message", updateMessageAmount);

        (async function () {
            const response = await TalkNetAPI.get(`/user/${user.id}/chats`);

            setUserChats(response.data);
        })();

        return function () {
            MessengerServiceConnection.removeOutcomingEventHandler("send-message", updateMessageAmount);
            MessengerServiceConnection.removeOutcomingEventHandler("connect-to-chats", connectToChatsHandler);
            MessengerServiceConnection.removeIncomingEventHandler("receive-message", updateMessageAmount);
        };
    }, []);

    React.useEffect(() => {
        userChatsRef.current = userChats;

        /**
         * Connecting to all user's chats
         */
        if (!userChats) {
            return;
        }

        // If socket that already in room will try to join it again then it attemption will be ignored
        // https://stackoverflow.com/questions/23930388/joining-same-room-more-then-once-and-clients-in-a-room
        MessengerServiceConnection.dispathOutcomingEvent({
            event: "connect-to-chats",
            payload: { userChatsIDs: userChats.map((chat) => chat.id) },
        });
    }, [userChats]);

    function updateChatInfo(chatID: string, newLastMessage: DialogueChatMessage, lastMessageIndexIncrement: number = 1) {
        // Getting userChats from ref cuz state is enclosed and will have incorrect value (see note above userChatsRef declaration).
        const curUserChats = userChatsRef.current;

        // Not sure is this condition will ever be true, but won't be redundant. Also useful for debugging.
        if (!curUserChats) {
            throw new Error("Информация о чатах пользователя не была загружена");
        }

        const targetedChat = curUserChats.find((chat) => chat.id === chatID);

        if (!targetedChat) {
            throw new Error("Не удалось обновить данные чата: Запрошенный чат не был найден");
        }

        targetedChat.messageAmount += lastMessageIndexIncrement;
        targetedChat.lastMessage = newLastMessage;

        setUserChats((p) => [...p!]);
    }

    function getCurrentChatID() {
        return new URLSearchParams(window.location.search).get("chat");
    }

    return { userChats, isChatsConnectionEstablised, getCurrentChatID, MessengerServiceConnection };
}
