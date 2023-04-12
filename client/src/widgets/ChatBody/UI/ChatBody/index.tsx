import "./ChatBody.scss";
import React from "react";

import NoOpenChatIcon from "@mui/icons-material/ReviewsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

import MessageInput from "../../../../features/MessageInput";
import ChatHeader from "../../../../features/ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import useMessengerService from "../../../../shared/model/hooks/useMessengerService";
import IMessangerService from "../../../../shared/types/shared/lib/MessangerService";
import { MessangerServiceIncomingEvent, MessangerServiceOutcomingEvent } from "../../../../shared/lib/MessangerServiceEvent";
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";
import { MemoChatFragment } from "../ChatFragment";
import { useChat } from "../../../../entities/Chat";

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
    const { MessengerServiceConnection, userChats, getCurrentChatID } = useChat();

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

        function handleReceiveMessage(e: MessangerServiceIncomingEvent<IMessangerService.IncomingEvent.Any>) {
            setMessages((p) => [e.payload as DialogueChatMessage, ...p]);
        }

        MessengerServiceConnection.addOutcomingEventHandler("get-chat-messages", handleGetChatMessages);

        MessengerServiceConnection.addOutcomingEventHandler("send-message", handleSendMessage);

        MessengerServiceConnection.addIncomingEventHandler("receive-message", handleReceiveMessage);

        return function () {
            MessengerServiceConnection.removeOutcomingEventHandler("get-chat-messages", handleGetChatMessages);
            MessengerServiceConnection.removeOutcomingEventHandler("send-message", handleSendMessage);
            MessengerServiceConnection.removeIncomingEventHandler("receive-message", handleReceiveMessage);
            MessengerServiceConnection.closeConnection();
        };
    }, []);

    React.useEffect(() => {
        if (!userChats || !chatID) {
            return;
        }

        MessengerServiceConnection.dispathOutcomingEvent({
            chatID: null, //TODO remove this
            event: "get-chat-messages",
            payload: {
                chatID: chatID!,
            },
        });
    }, [userChats]);

    if (getIsUserHasAccessToRequested() === false) {
        // throw new Error(`You haven't premission to view this chat`);
    }

    function getIsUserHasAccessToRequested() {
        if (!userChats) {
            return null;
        }

        const currentChatdID = getCurrentChatID();

        for (const chat of userChats) {
            if (chat.id === currentChatdID) {
                return true;
            }
        }

        return false;
    }

    function sendMessage() {
        const inputElement = messageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.innerText;

        if (!inputedMessage) {
            return;
        }

        MessengerServiceConnection.dispathOutcomingEvent({
            chatID: null, // TODO remove this
            event: "send-message",
            payload: { chatID: chatID!, message: inputedMessage, sentDate: Date.now() },
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
                                    // BUG There are error if no messages today

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
                                        <MemoChatFragment
                                            key={message._id}
                                            message={message}
                                            nextMessage={nextMessage}
                                            user={user!}
                                            isLatestMessage={isLatestMessage}
                                            isBlockEnded={isBlockEnded}
                                            isPrevMessageLatest={isPrevMessageLatest}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            // TODO fix it
                            <div className="TNUI-ChatBody-no-messages-alert">No messages</div>
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
                <span className="TNUI-ChatBody-no-open-chat-alert">
                    <NoOpenChatIcon className="TNUI-ChatBody-no-open-chat-alert_icon" />
                    <span className="TNUI-ChatBody-no-open-chat-alert_label">Ни один чат не открыт</span>
                </span>
            )}
        </div>
    );
}
