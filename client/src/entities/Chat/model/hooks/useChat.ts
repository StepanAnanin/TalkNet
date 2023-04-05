import React from "react";

import type IMessengerService from "../../../../shared/types/shared/lib/MessangerService";
import type DialogueChat from "../../../../shared/types/features/DialogueChat";

import useMessengerService from "../../../../shared/model/hooks/useMessangerService";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { MessangerServiceOutcomingEvent } from "../../../../shared/lib/MessangerServiceEvent";
import DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

/**
 * @returns Currently authorized user's chats or null, if loading.
 */
export default function useChat() {
    const [userChats, setUserChats] = React.useState<DialogueChat[] | null>(null);

    // This needed cuz userChats is enclosed, hence will have incorrect value in functions declared in this scope (like updateChatInfo).
    // This is a fucked way to fix that, but I didn’t come up with a better one.
    const userChatsRef = React.useRef<DialogueChat[] | null>(null);

    const { user } = useTypedSelector((state) => state.auth);

    const messengerServiceConnection = useMessengerService();

    React.useEffect(() => {
        userChatsRef.current = userChats;
    }, [userChats]);

    if (!user) {
        throw new Error(`useChat hook require authorization`);
    }

    // TODO check is there a point to close messenger service connection
    React.useEffect(() => {
        // Strange name, but it's very useful for debugging, cuz handler "handleSendMessage" already exist.
        function updateMessageAmountOnSendMessage(e: MessangerServiceOutcomingEvent<IMessengerService.OutcomingEvent.Any>) {
            updateChatInfo(e.chatID, e.payload as DialogueChatMessage);
        }

        messengerServiceConnection.addOutcomingEventHandler("send-message", updateMessageAmountOnSendMessage);

        (async function () {
            const response = await TalkNetAPI.get(`/user/${user.id}/chats`);

            setUserChats(response.data);
        })();

        return function () {
            messengerServiceConnection.removeOutcomingEventHandler("send-message", updateMessageAmountOnSendMessage);
        };
    }, []);

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

    if (!userChats) {
        return null;
    }

    return userChats;
}
