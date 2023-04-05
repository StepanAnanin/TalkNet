import "./ChatBody.scss";
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
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";
import MessageBlockDateDivider from "../MessageBlockDateDivider";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

// TODO Check is overflow work correctly (Now not)
// TODO maybee scale down MessageInput width at ~30-40%?
export default function ChatBody(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    const [messages, setMessages] = React.useState<DialogueChatMessage[]>([]);

    const messageInputRef = React.useRef<HTMLDivElement>(null);
    const prevMessageSentDateDayDifferenceRef = React.useRef(0);

    const { user } = useTypedSelector((state) => state.auth);
    const MessangerServiceConnection = useMessangerService();

    // console.log("ChatID: " + chatID);

    React.useEffect(() => {
        if (!chatID) {
            return;
        }

        // BUG now "e" has a problem with typesation
        function handleGetChatMessages(e: MessangerServiceOutcomingEvent<IMessangerService.OutcomingEvent.Any>) {
            setMessages((e.payload as DialogueChatMessage[]).reverse());
        }

        function handleSendMessage(e: MessangerServiceOutcomingEvent<IMessangerService.OutcomingEvent.Any>) {
            const message = e.payload as DialogueChatMessage;

            setMessages((p) => [message, ...p]);
        }

        MessangerServiceConnection.addOutcomingEventHandler("get-chat-messages", handleGetChatMessages);

        MessangerServiceConnection.addOutcomingEventHandler("send-message", handleSendMessage);

        MessangerServiceConnection.dispathOutcomingEvent({
            chatID: chatID!,
            event: "get-chat-messages",
            payload: {},
        });

        return function () {
            MessangerServiceConnection.removeOutcomingEventHandler("get-chat-messages", handleGetChatMessages);
            MessangerServiceConnection.removeOutcomingEventHandler("send-message", handleSendMessage);
            MessangerServiceConnection.closeConnection();
        };
    }, []);

    function sendMessage() {
        const inputElement = messageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.innerText;

        if (!inputedMessage) {
            return;
        }

        MessangerServiceConnection.dispathOutcomingEvent({
            chatID: chatID!,
            event: "send-message",
            payload: { message: inputedMessage, sentDate: Date.now() },
        });

        inputElement.innerText = "";
    }

    function sendButtonClickHandler(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        sendMessage();
    }

    function inputEnterKeyPressHandler(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.code === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            return;
        }
    }

    const classes = ["TNUI-ChatBody", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {chatID ? (
                <>
                    <ChatHeader />
                    <div className="TNUI-ChatBody-content">
                        {messages ? (
                            <div className="TNUI-ChatBody-messages">
                                {messages.map((message, index, arr) => {
                                    // Keep in mind that this array is inverted.
                                    const nextMessage = arr[index - 1];
                                    const prevMessage = arr[index + 1];
                                    const isLatestMessage = prevMessage === undefined;
                                    const isPrevMessageLatest = arr[index + 2] === undefined;

                                    const prevMessageSentDateDayDifference = prevMessageSentDateDayDifferenceRef.current;
                                    const sentDateDayDifference = FormatedDate.dayDifference(Date.now(), message.sentDate);

                                    let isBlockEnded = false;

                                    if (sentDateDayDifference > prevMessageSentDateDayDifference) {
                                        isBlockEnded = true;
                                    }

                                    prevMessageSentDateDayDifferenceRef.current = sentDateDayDifference;

                                    // TODO
                                    // I'm also wanted to add label for chat end, but there are some problems with it,
                                    // main of them is that it will work correctly only all chat's messages are loaded and rendered,
                                    // otherwise this label will always show up when user scroll at the end of chat.
                                    // So i decided temporarily abandon this idea.
                                    return (
                                        <React.Fragment key={message._id}>
                                            {isBlockEnded && (!isLatestMessage || isPrevMessageLatest) && (
                                                <MessageBlockDateDivider date={nextMessage.sentDate} />
                                            )}
                                            <DialogueMessage
                                                read={!!message.readDate}
                                                style={{ paddingInline: "5px", marginBlock: "10px" }}
                                                sender={message.sentBy === user!.id ? "user" : "interlocutor"}
                                                sentDate={message.sentDate}
                                            >
                                                {message.data}
                                            </DialogueMessage>
                                            {isLatestMessage && <MessageBlockDateDivider date={message.sentDate} />}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>no messages</div>
                        )}
                        <MessageInput
                            className="TNUI-ChatBody-message-input"
                            ref={messageInputRef}
                            onSendButtonClick={sendButtonClickHandler}
                            onKeyDown={inputEnterKeyPressHandler}
                        />
                    </div>
                </>
            ) : (
                <span style={{ color: "white", marginTop: "50px", fontSize: "24px", width: "100%", textAlign: "center" }}>
                    No chat is currently open
                </span>
            )}
        </div>
    );
}
