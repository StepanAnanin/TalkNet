import "./Chat.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

import MessageInput from "../../../../features/MessageInput";
import DialogueMessage from "../../../../shared/UI/DialogueMessage";
import ChatHeader from "../../../../features/ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import useMessangerService from "../../../../shared/model/hooks/useMessangerService";
import IMessangerService from "../../../../shared/types/shared/lib/MessangerService";
import { MessangerServiceOutcomingEvent } from "../../../../shared/lib/MessangerServiceEvent";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

// TODO Check is overflow work correctly (Now not)
// TODO maybee scale down MessageInput width at ~30-40%?
export default function Chat(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    const [messages, setMessages] = React.useState<DialogueChatMessage[]>([]);

    const messageInputRef = React.useRef<HTMLDivElement>(null);

    const { user } = useTypedSelector((state) => state.auth);
    const MessangerServiceConnection = useMessangerService();

    // console.log("ChatID: " + chatID);

    React.useEffect(() => {
        function handleGetChatMessages(e: MessangerServiceOutcomingEvent<IMessangerService.OutcomingEvent.Any>) {
            setMessages((e.payload as DialogueChatMessage[]).reverse());
        }

        MessangerServiceConnection.addOutcomingEventHandler("get-chat-messages", handleGetChatMessages);

        // MessangerServiceConnection.addOutcomingEventHandler("establish-connection", (e) => {});

        MessangerServiceConnection.dispathOutcomingEvent({
            chatID: chatID!,
            event: "get-chat-messages",
            payload: {},
        });

        return function () {
            MessangerServiceConnection.removeOutcomingEventHandler("get-chat-messages", handleGetChatMessages);
            MessangerServiceConnection.closeConnection();
        };
    }, []);

    function sendButtonClickHandler(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        const inputElement = messageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.textContent;

        if (!inputedMessage) {
            return;
        }

        MessangerServiceConnection.dispathOutcomingEvent({
            chatID: chatID!,
            event: "send-message",
            payload: { message: inputedMessage, sentDate: Date.now() },
        });
    }

    const classes = ["TNUI-Chat", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <ChatHeader />
            <div className="TNUI-Chat-content">
                {messages ? (
                    <div className="TNUI-Chat-messages">
                        {messages.map((message) => {
                            return (
                                <DialogueMessage
                                    key={message._id}
                                    read={!!message.readDate}
                                    style={{ paddingInline: "5px", marginBlock: "10px" }}
                                    sender={message.sentBy === user!.id ? "user" : "interlocutor"}
                                    sentDate={message.sentDate}
                                >
                                    {message.data}
                                </DialogueMessage>
                            );
                        })}
                    </div>
                ) : (
                    <div>no messages</div>
                )}
                <MessageInput
                    className="TNUI-Chat-message-input"
                    ref={messageInputRef}
                    onSendButtonClick={sendButtonClickHandler}
                />
            </div>
        </div>
    );
}
