import React from "react";

import ChatFragment, { MemoChatFragment } from "../UI/ChatFragment";
import IChatMessage from "../../../shared/types/entities/IChatMessage";
import User from "../../../shared/types/entities/User";
import useMessengerService from "../../../shared/model/hooks/useMessengerService";
import FormatedDate from "../../../shared/lib/FormatedDate";

export default function parseChatMessages(
    messages: IChatMessage[],
    user: User,
    MessengerServiceConnection: ReturnType<typeof useMessengerService>,
    chatID: string
) {
    let prevMessageSentDateDayDifference = 0;

    return messages.map((message, index, arr) => {
        // Keep in mind that this array is inverted. And it goes from latest message to first.
        // (prev message is below and next message is above)
        const nextMessage = arr[index - 1];
        const prevMessage = arr[index + 1];
        const isFirstMessage = prevMessage === undefined;
        const isPrevMessageFirst = arr[index + 2] === undefined;

        const messageSender = message.sentBy === user!.id ? "user" : "interlocutor";
        const nextMessageSender = (function () {
            if (!nextMessage) {
                return null;
            }

            return nextMessage.sentBy === user!.id ? "user" : "interlocutor";
        })();

        const isUnreadMessagesBlockStart = (function () {
            // if all messages are read
            if (index === 0 && !!message.readDate) {
                return false;
            }

            // if all messages aren't read
            if (!prevMessage && message.readDate === null) {
                return true;
            }

            // Is there an any point in this condition?
            if (!prevMessage && !!message.readDate) {
                return false;
            }

            return (
                message.readDate !== null &&
                nextMessage.readDate === null &&
                nextMessageSender === "interlocutor" &&
                messageSender === "user"
            );
        })();

        const sentDateDayDifference = FormatedDate.dayDifference(Date.now(), message.sentDate);

        let isBlockEnded = false;

        if (sentDateDayDifference > prevMessageSentDateDayDifference) {
            isBlockEnded = true;
        }

        prevMessageSentDateDayDifference = sentDateDayDifference;

        // TODO
        // I'm also wanted to add label for chat end, but there are some problems with it,
        // main of them is that it will work correctly only all chat's messages are loaded and rendered,
        // otherwise this label will always show up when user scroll at the end of chat.
        // So i decided temporarily abandon this idea.
        return (
            <ChatFragment
                key={message._id}
                index={index}
                message={message}
                nextMessage={nextMessage}
                chatMessages={messages}
                messageSender={messageSender}
                chatID={chatID}
                isFirstMessage={isFirstMessage}
                isBlockEnded={isBlockEnded}
                isPrevMessageFirst={isPrevMessageFirst}
                isUnreadMessagesBlockStart={isUnreadMessagesBlockStart}
                MessengerServiceConnection={MessengerServiceConnection}
            />
        );
    });
}
