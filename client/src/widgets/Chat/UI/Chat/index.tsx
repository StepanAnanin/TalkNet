import "./Chat.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import MessageInput from "../../../../features/MessageInput";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";
import ChatHeader from "../../../../features/ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import useMessangerService from "../../../../shared/model/hooks/useMessangerService";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

// TODO Check is overflow for correctly
// TODO maybee scale down MessageInput width at ~30-40%?
export default function Chat(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    const { user } = useTypedSelector((state) => state.auth);
    const messageInputRef = React.useRef<HTMLDivElement>(null);
    const { dispathMessangerServiceEvent } = useMessangerService();

    // console.log("ChatID: " + chatID);

    const messages = [
        <DialogueMessage key={1} read style={{ paddingInline: "5px", marginBlock: "10px" }} sender="interlocutor">
            Hi
        </DialogueMessage>,
        <DialogueMessage key={2} read style={{ paddingInline: "5px", marginBlock: "10px" }} sender="user">
            Hello
        </DialogueMessage>,
        <DialogueMessage key={3} read style={{ paddingInline: "5px", marginBlock: "10px" }} sender="interlocutor">
            What's your name?
        </DialogueMessage>,
        <DialogueMessage key={4} read changed style={{ paddingInline: "5px", marginBlock: "10px" }} sender="user">
            Nill Kiggers
        </DialogueMessage>,
    ].reverse(); // Using '.reverse' is bad, it's complexity is O(n)

    const classes = ["TNUI-Chat", className].join(" ");

    function sendButtonClickHandler(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const inputElement = messageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.textContent;

        if (!inputedMessage) {
            return;
        }

        dispathMessangerServiceEvent({
            chatID: chatID!,
            event: "send-message",
            payload: { message: inputedMessage, sentDate: Date.now() },
        });
    }

    return (
        <div className={classes} {...otherProps}>
            <ChatHeader />
            <div className="TNUI-Chat-content">
                <div className="TNUI-Chat-messages">{messages}</div>
                <MessageInput
                    className="TNUI-Chat-message-input"
                    ref={messageInputRef}
                    onSendButtonClick={sendButtonClickHandler}
                />
            </div>
        </div>
    );
}
