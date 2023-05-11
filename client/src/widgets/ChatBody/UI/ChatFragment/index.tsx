import "./ChatFragment.scss";
import React from "react";

import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

import MessageBlockDateDivider from "../MessageBlockDateDivider";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";
import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import handleUpdateMessageReadDate from "../../model/updateMessageReadDate";
import MessengerServiceModel from "../../../../shared/types/shared/lib/MessengerServiceModel";
import addOnViewListener from "../../../../shared/types/shared/lib/addOnViewListener";

interface ChatFragmentProps {
    index: number;
    message: DialogueChatMessage;
    nextMessage?: DialogueChatMessage;
    chatMessages: DialogueChatMessage[];
    isBlockEnded: boolean;
    isFirstMessage: boolean;
    isPrevMessageFirst: boolean;
    isUnreadMessagesBlockStart: boolean;
    chatID: string;
    messageSender: "user" | "interlocutor";
    MessengerServiceConnection: ReturnType<typeof useMessengerService>;
}

export default function ChatFragment(props: ChatFragmentProps) {
    const {
        index: messageIndex,
        messageSender,
        chatID,
        message,
        nextMessage,
        chatMessages,
        isBlockEnded,
        isFirstMessage,
        isPrevMessageFirst,
        isUnreadMessagesBlockStart,
        MessengerServiceConnection,
    } = props;

    // const chatMessages = userChats.find(chat => chat.id === chatID).
    const [currentMessage, setCurrentMessage] = React.useState(message);

    const messageElementRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (currentMessage.readDate !== null) {
            return;
        }

        let viewObserver: IntersectionObserver | null = null;

        if (messageSender === "interlocutor") {
            // If it's === null, then addOnViewListener will throw error.
            const messageElement = messageElementRef.current!;

            viewObserver = addOnViewListener(messageElement, function () {
                handleUpdateMessageReadDate(messageIndex, function () {
                    MessengerServiceConnection.dispathOutcomingEvent({
                        event: "update-message-read-date",
                        payload: { newReadDate: Date.now(), messageID: currentMessage._id, chatID },
                    });
                });
            });

            viewObserver.observe(messageElement);
        }

        MessengerServiceConnection.addOutcomingEventHandler(
            "update-message-read-date",
            updateMessageReadDateEventResponseHandler as any
        );

        return function () {
            MessengerServiceConnection.removeOutcomingEventHandler(
                "update-message-read-date",
                updateMessageReadDateEventResponseHandler as any
            );

            viewObserver && viewObserver.disconnect();
        };
    }, [currentMessage]);

    // TODO idk why and how, but this work... (but shouldn't or ??????)
    // TODO seems like there are some excess renders...
    function updateMessageReadDateEventResponseHandler(
        e: MessengerServiceModel.OutcomingEvent.Response.UpdateMessageReadDate
    ) {
        // I remind that object is reference type
        const readMessageTwin = e.payload.message;
        const indexOfReadMessage = e.payload.index;

        // TODO do something with inverted array of messages.
        // On client this array is inverted, but not on server.
        // So need to cast indexes for them to point to correct message.
        // P.S. Seems like inverting of array was a bad idea... (should i did this on server?)
        const indexOfLastFirstMessage = chatMessages.length - 1;
        const fixedIndexOfReadMessage = indexOfLastFirstMessage - indexOfReadMessage;

        // If current message wasn't read
        if (messageIndex < fixedIndexOfReadMessage) {
            return;
        }

        setCurrentMessage((p) => {
            return { ...p, readDate: readMessageTwin.readDate };
        });
    }

    // Keep in mind that all this elements are rendered on page in reverse order.
    // (cuz in ChatBody they used in reversed array)
    return (
        <React.Fragment>
            {isUnreadMessagesBlockStart && (
                <div className="TNUI-ChatFragment-unread-messages-block-start-alert" id="unread-messages-alert">
                    Непрочитанные сообщения
                </div>
            )}
            {isBlockEnded && nextMessage && (!isFirstMessage || isPrevMessageFirst) && (
                <MessageBlockDateDivider date={nextMessage.sentDate} />
            )}
            <DialogueMessage
                id={currentMessage._id}
                ref={messageElementRef}
                read={!!currentMessage.readDate}
                sender={messageSender}
                sentDate={currentMessage.sentDate}
            >
                {currentMessage.data}
            </DialogueMessage>
            {isFirstMessage && <MessageBlockDateDivider date={currentMessage.sentDate} />}
            {isFirstMessage && isUnreadMessagesBlockStart && (
                <div className="TNUI-ChatFragment-unread-messages-block-start-alert" id="unread-messages-alert">
                    Непрочитанные сообщения
                </div>
            )}
        </React.Fragment>
    );
}

export const MemoChatFragment = React.memo(ChatFragment);
