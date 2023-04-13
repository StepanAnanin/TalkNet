import React from "react";

import type User from "../../../../shared/types/entities/User";
import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

import MessageBlockDateDivider from "../MessageBlockDateDivider";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";

interface ChatFragmentProps {
    message: DialogueChatMessage;
    nextMessage?: DialogueChatMessage;
    isBlockEnded: boolean;
    isLatestMessage: boolean;
    isPrevMessageLatest: boolean;
    user: User;
}

export default function ChatFragment(props: ChatFragmentProps) {
    const { user, message, nextMessage, isBlockEnded, isLatestMessage, isPrevMessageLatest } = props;

    return (
        <React.Fragment>
            {isBlockEnded && nextMessage && (!isLatestMessage || isPrevMessageLatest) && (
                <MessageBlockDateDivider date={nextMessage.sentDate} />
            )}
            <DialogueMessage
                read={!!message.readDate}
                sender={message.sentBy === user!.id ? "user" : "interlocutor"}
                sentDate={message.sentDate}
            >
                {message.data}
            </DialogueMessage>
            {isLatestMessage && <MessageBlockDateDivider date={message.sentDate} />}
        </React.Fragment>
    );
}

export const MemoChatFragment = React.memo(ChatFragment);
