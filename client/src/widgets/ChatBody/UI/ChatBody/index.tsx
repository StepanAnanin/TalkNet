import "./ChatBody.scss";
import React from "react";

import NoOpenChatIcon from "@mui/icons-material/ReviewsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type DialogueChatMessage from "../../../../shared/types/shared/DialogueChatMessage";

import { MemoMessageInput } from "../../../../features/MessageInput";
import ChatHeader from "../../../../features/ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import MessengerServiceModel from "../../../../shared/types/shared/lib/MessengerServiceModel";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../shared/lib/MessengerServiceEvent";
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";
import ChatFragment, { MemoChatFragment } from "../ChatFragment";
import { useChat } from "../../../../entities/Chat";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

// TODO Check is overflow work correctly (Now not)
// TODO maybee scale down MessageInput width at ~30-40%?
// TODO try to get rid of excess renders
export default function ChatBody(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    const { MessengerServiceConnection, getCurrentChatID } = useChat();

    const { chatList, auth } = useTypedSelector((state) => state);
    const userChats = chatList.payload;
    const user = auth.payload;

    const [messages, setMessages] = React.useState<DialogueChatMessage[]>([]);
    const [isMessageSendInProgress, setIsMessageSendInProgress] = React.useState(false);

    const messageInputRef = React.useRef<HTMLDivElement>(null);
    const prevMessageSentDateDayDifferenceRef = React.useRef(0);

    const sendButtonClickHandler = React.useCallback(
        function () {
            sendMessage();
        },
        [chatID, isMessageSendInProgress] // this is dependecies for sendMessage
    );

    const inputEnterKeyPressHandler = React.useCallback(
        function (e: React.KeyboardEvent<HTMLDivElement>) {
            if (e.code === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                return;
            }
        },
        [chatID, isMessageSendInProgress] // this is dependecies for sendMessage
    );

    React.useEffect(() => {
        // BUG now "e" has a problem with typesation
        function handleGetChatMessagesResponse(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceModel.OutcomingEvent.Response.Any>
        ) {
            setMessages((e.payload as any).reverse());
        }

        function handleSendMessageResponse(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceModel.OutcomingEvent.Response.Any>
        ) {
            const message = e.payload as DialogueChatMessage;
            const inputElement = messageInputRef.current;

            if (!(inputElement instanceof HTMLElement)) {
                throw new TypeError("Message input element has incorrect data type or doesn't exist");
            }

            setMessages((p) => [message, ...p]);
            setIsMessageSendInProgress(false);

            inputElement.innerText = "";
        }

        function handleReceiveMessage(e: MessengerServiceIncomingEvent<MessengerServiceModel.IncomingEvent.Any>) {
            setMessages((p) => [e.payload as DialogueChatMessage, ...p]);
        }

        MessengerServiceConnection.addOutcomingEventHandler("get-chat-messages", handleGetChatMessagesResponse);

        MessengerServiceConnection.addOutcomingEventHandler("send-message", handleSendMessageResponse);

        MessengerServiceConnection.addIncomingEventHandler("receive-message", handleReceiveMessage);

        return function () {
            MessengerServiceConnection.removeOutcomingEventHandler("get-chat-messages", handleGetChatMessagesResponse);
            MessengerServiceConnection.removeOutcomingEventHandler("send-message", handleSendMessageResponse);
            MessengerServiceConnection.removeIncomingEventHandler("receive-message", handleReceiveMessage);
        };
    }, []);

    React.useEffect(() => {
        if (!userChats || !chatID) {
            return;
        }

        MessengerServiceConnection.dispathOutcomingEvent({
            event: "get-chat-messages",
            payload: {
                chatID: chatID!,
            },
        });
    }, [userChats]);

    if (getIsUserHasAccessToRequested() === false) {
        throw new Error(`У вас нет доступа к этому чату`);
    }

    function getIsUserHasAccessToRequested() {
        if (!userChats || !chatID) {
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
        if (isMessageSendInProgress) {
            return;
        }

        const inputElement = messageInputRef.current;

        if (!(inputElement instanceof HTMLElement)) {
            throw new TypeError("Message input element has incorrect data type or doesn't exist");
        }

        const inputedMessage = inputElement.innerText;

        if (!inputedMessage.replaceAll(" ", "")) {
            return;
        }

        MessengerServiceConnection.dispathOutcomingEvent({
            event: "send-message",
            payload: { chatID: chatID!, message: inputedMessage, sentDate: Date.now() },
        });

        setIsMessageSendInProgress(true);
    }

    const classes = ["TNUI-ChatBody", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {chatID ? (
                <>
                    {userChats && <ChatHeader chat={userChats.find((chat) => chat.id === getCurrentChatID())!} />}
                    <div className="TNUI-ChatBody-content">
                        {messages ? (
                            <div className="TNUI-ChatBody-messages">
                                {messages.map((message, index, arr) => {
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
                                })}
                            </div>
                        ) : (
                            // TODO fix it
                            <div className="TNUI-ChatBody-no-messages-alert">No messages</div>
                        )}
                        <MemoMessageInput
                            className="TNUI-ChatBody-message-input"
                            ref={messageInputRef}
                            isMessageSendInProgress={isMessageSendInProgress}
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
