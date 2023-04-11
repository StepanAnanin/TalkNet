import React from "react";

import type IMessengerService from "../../../../shared/types/shared/lib/MessangerService";
import type DialogueChat from "../../../../shared/types/features/DialogueChat";

import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { MessangerServiceIncomingEvent, MessangerServiceOutcomingEvent } from "../../../../shared/lib/MessangerServiceEvent";
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

    const messengerServiceConnection = useMessengerService();

    React.useEffect(() => {
        userChatsRef.current = userChats;
    }, [userChats]);

    // TODO check is there a point to close messenger service connection
    React.useEffect(() => {
        function updateMessageAmount(
            e:
                | MessangerServiceOutcomingEvent<IMessengerService.OutcomingEvent.Any>
                | MessangerServiceIncomingEvent<IMessengerService.IncomingEvent.Any>
        ) {
            updateChatInfo((e.payload as any).chatID, e.payload as DialogueChatMessage);
        }

        // function connectToChatsHandler(e: MessangerServiceOutcomingEvent<IMessengerService.OutcomingEvent.Any>) {}

        messengerServiceConnection.addOutcomingEventHandler("send-message", updateMessageAmount);
        messengerServiceConnection.addIncomingEventHandler("receive-message", updateMessageAmount);

        (async function () {
            const response = await TalkNetAPI.get(`/user/${user.id}/chats`);

            setUserChats(response.data);
        })();

        return function () {
            messengerServiceConnection.removeOutcomingEventHandler("send-message", updateMessageAmount);
            messengerServiceConnection.removeIncomingEventHandler("receive-message", updateMessageAmount);
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

    /**
     * Connecting to all user's chats
     */
    function connect(userChatsIDs: string[]) {
        if (isChatsConnectionEstablised) {
            console.warn("Connection to chats already established");
            return;
        }

        messengerServiceConnection.dispathOutcomingEvent({
            event: "connect-to-chats",
            chatID: null, // TODO remove this
            payload: { userChatsIDs: userChatsIDs },
        });

        setIsChatsConnectionEstablised(true);
    }

    return { userChats, connect, isChatsConnectionEstablised };
}
