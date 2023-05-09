import "./ChatFragment.scss";
import React from "react";

import type User from "../../../../shared/types/entities/User";
import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";
import type DialogueChat from "../../../../shared/types/features/DialogueChat";

import MessageBlockDateDivider from "../MessageBlockDateDivider";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";
import updateMessageReadDate from "../../model/updateMessageReadDate";
import { useChat } from "../../../../entities/Chat";

interface ChatFragmentProps {
    index: number;
    message: DialogueChatMessage;
    nextMessage?: DialogueChatMessage;
    isBlockEnded: boolean;
    isFirstMessage: boolean;
    isPrevMessageFirst: boolean;
    isUnreadMessagesBlockStart: boolean;
    chatID: string;
    user: User;
}

export default function ChatFragment(props: ChatFragmentProps) {
    const {
        index,
        user,
        chatID,
        message,
        nextMessage,
        isBlockEnded,
        isFirstMessage,
        isPrevMessageFirst,
        isUnreadMessagesBlockStart,
    } = props;

    const x = useChat();

    const messageElementRef = React.useRef<HTMLDivElement | null>(null);
    const messageSender = message.sentBy === user!.id ? "user" : "interlocutor";

    React.useEffect(() => {
        if (message.readDate !== null || messageSender === "user") {
            return;
        }

        const messageElement = messageElementRef.current;

        if (!(messageElement instanceof HTMLElement)) {
            throw new TypeError("Failed to find messageElement");
        }

        const intersectorObserverOptions: IntersectionObserverInit = {
            root: messageElement.parentElement,
            threshold: 1,
            rootMargin: "0px",
        };

        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];

            if (entry.isIntersecting) {
                updateMessageReadDate(chatID, message._id, index);
                // const element = entry.target;
            }
        }, intersectorObserverOptions);

        observer.observe(messageElement);

        return function () {
            observer.disconnect();
        };
    }, []);

    // Keep in mind that all this elements are rendered on page in reverse order.
    // (cuz in ChatBody they used in reversed array)
    return (
        <React.Fragment>
            {isBlockEnded && nextMessage && (!isFirstMessage || isPrevMessageFirst) && (
                <MessageBlockDateDivider date={nextMessage.sentDate} />
            )}
            <DialogueMessage
                id={message._id}
                ref={messageElementRef}
                read={!!message.readDate}
                sender={messageSender}
                sentDate={message.sentDate}
            >
                {message.data}
            </DialogueMessage>
            {isFirstMessage && <MessageBlockDateDivider date={message.sentDate} />}
            {isUnreadMessagesBlockStart && (
                <div className="TNUI-ChatFragment-unread-messages-block-start-alert" id="unread-messages-alert">
                    Непрочитанные сообщения
                </div>
            )}
        </React.Fragment>
    );
}

export const MemoChatFragment = React.memo(ChatFragment);
