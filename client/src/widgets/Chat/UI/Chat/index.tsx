import "./Chat.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import MessageInput from "../../../../features/MessageInput";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";
import ChatHeader from "../../../../features/ChatHeader";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

// TODO Check is overflow for correctly
// TODO maybee scale down MessageInput width at ~30-40%?
export default function Chat(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    console.log(chatID);

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

    return (
        <div className={classes} {...otherProps}>
            <ChatHeader />
            <div className="TNUI-Chat-content">
                <div className="TNUI-Chat-messages">{messages}</div>
                <MessageInput className="TNUI-Chat-message-input" />
            </div>
        </div>
    );
}
