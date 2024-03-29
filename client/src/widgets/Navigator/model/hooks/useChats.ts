import React from "react";

import type MessengerServiceEventModel from "../../../../shared/types/shared/lib/MessengerService/MessengerServiceModel";

import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import IChatMessage from "../../../../shared/types/entities/IChatMessage";
import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../shared/lib/MessengerService/MessengerServiceEvent";
import chatListSlice from "../../../../shared/model/store/reducers/chatListReducer";

/**
 * Returns the user's automatically updating chats
 */
export default function useChats() {
    const { auth, chatList } = useTypedSelector((state) => state);
    const dispatch = useTypedDispatch();
    const userChats = chatList.payload;

    const user = auth.payload;

    if (!user) {
        throw new Error(`Authorization required`);
    }

    // This needed cuz userChats is enclosed, hence will have incorrect value in functions declared in this scope (like updateChatInfo).
    // This is a fucked way to fix that, but I didn’t come up with a better one.
    const userChatsRef = React.useRef<typeof userChats>(userChats);

    const MessengerServiceConnection = useMessengerService();

    React.useEffect(() => {
        function updateMessageAmount(
            e:
                | MessengerServiceOutcomingEventResponse<MessengerServiceEventModel.OutcomingEvent.Response.Any>
                | MessengerServiceIncomingEvent<MessengerServiceEventModel.IncomingEvent.Any>
        ) {
            updateChatInfo((e.payload as any).chatID, e.payload as IChatMessage);
        }

        MessengerServiceConnection.addEventHandler("send-message", updateMessageAmount);
        MessengerServiceConnection.addEventHandler("receive-message", updateMessageAmount);

        (async function () {
            const response = await TalkNetAPI.get(`/user/${user.id}/chats`);

            dispatch(chatListSlice.actions.setChatList(response.data));
        })();

        return function () {
            MessengerServiceConnection.removeEventHandler("send-message", updateMessageAmount);
            MessengerServiceConnection.removeEventHandler("receive-message", updateMessageAmount);
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
            name: "connect-to-chats",
            payload: { userChatsIDs: userChats.map((chat) => chat.id) },
        });
    }, [userChats]);

    function updateChatInfo(chatID: string, newLastMessage: IChatMessage, lastMessageIndexIncrement: number = 1) {
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

        dispatch(
            chatListSlice.actions.updateChat({
                ...targetedChat,
                messageAmount: targetedChat.messageAmount + lastMessageIndexIncrement,
                lastMessage: newLastMessage,
            })
        );
    }

    return userChats;
}
