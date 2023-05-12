import "./Chat.scss";
import React from "react";

import NoOpenChatIcon from "@mui/icons-material/ReviewsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type IChatMessage from "../../../../shared/types/entities/IChatMessage";

import { MemoMessageInput } from "../../../../features/MessageInput";
import ChatHeader from "../ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import MessengerServiceModel from "../../../../shared/types/shared/lib/MessengerServiceModel";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../shared/lib/MessengerServiceEvent";
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";
import ChatFragment, { MemoChatFragment } from "../ChatFragment";
import useChat from "../../../../shared/model/hooks/useChat";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { AxiosError } from "axios";
import { DoubledLoader } from "../../../../shared/UI/Loader";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    chatID: string | null;
}

interface MessagesState {
    payload: IChatMessage[] | null;
    requestStatus: "Pending" | "Success" | "Error";
}

// TODO Check is overflow work correctly (Now not)
// TODO try to get rid of excess renders
export default function Chat(props: ChatProps) {
    const { className = "", chatID, ...otherProps } = props;

    const { MessengerServiceConnection, getCurrentChatID } = useChat();
    const currentChatID = getCurrentChatID();

    const { chatList, auth } = useTypedSelector((state) => state);
    const userChats = chatList.payload;
    const user = auth.payload;

    const [messages, setMessages] = React.useState<MessagesState>({ requestStatus: "Pending", payload: null });
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
        if (!currentChatID) {
            return;
        }

        (async function () {
            try {
                const response = await TalkNetAPI.post(`/chat/messages/${chatID}`, { userID: user?.id });
                // TODO try to get rid of reverse
                setMessages({ requestStatus: "Success", payload: response.data.reverse() });
            } catch (err) {
                if (!(err instanceof AxiosError)) {
                    throw err;
                }

                setMessages({ requestStatus: "Success", payload: null });

                console.error(err);
            }
        })();

        // BUG now "e" has a problem with typesation
        function handleSendMessageResponse(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceModel.OutcomingEvent.Response.Any>
        ) {
            const message = e.payload as IChatMessage;
            const inputElement = messageInputRef.current;

            if (!(inputElement instanceof HTMLElement)) {
                throw new TypeError("Message input element has incorrect data type or doesn't exist");
            }

            setMessages((p) => {
                return { ...p, payload: p.payload ? [message, ...p.payload] : [message] };
            });
            setIsMessageSendInProgress(false);

            inputElement.innerText = "";
        }

        function handleReceiveMessage(e: MessengerServiceIncomingEvent<MessengerServiceModel.IncomingEvent.Any>) {
            setMessages((p) => {
                return {
                    ...p,
                    payload: p.payload ? [e.payload as IChatMessage, ...p.payload] : [e.payload as IChatMessage],
                };
            });
        }

        MessengerServiceConnection.addOutcomingEventHandler("send-message", handleSendMessageResponse);

        MessengerServiceConnection.addIncomingEventHandler("receive-message", handleReceiveMessage);

        return function () {
            MessengerServiceConnection.removeOutcomingEventHandler("send-message", handleSendMessageResponse);
            MessengerServiceConnection.removeIncomingEventHandler("receive-message", handleReceiveMessage);
        };
    }, [currentChatID]);

    if (getIsUserHasAccessToChat() === false) {
        throw new Error(`У вас нет доступа к этому чату`);
    }

    function getIsUserHasAccessToChat() {
        if (!userChats || !chatID) {
            return null;
        }

        for (const chat of userChats) {
            if (chat.id === currentChatID) {
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

    const classes = ["TNUI-Chat", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {chatID ? (
                <>
                    {userChats && <ChatHeader chat={userChats.find((chat) => chat.id === getCurrentChatID())!} />}
                    <div className="TNUI-Chat-content">
                        {messages.requestStatus === "Success" &&
                            (messages.payload!.length > 0 ? (
                                <div className="TNUI-Chat-messages">
                                    {messages.payload!.map((message, index, arr) => {
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
                                        const sentDateDayDifference = FormatedDate.dayDifference(
                                            Date.now(),
                                            message.sentDate
                                        );

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
                                                chatMessages={messages.payload!}
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
                                <div className="TNUI-Chat-no-messages-alert">No messages</div>
                            ))}
                        {messages.requestStatus === "Pending" && (
                            <div className="TNUI-Chat-loader">
                                <DoubledLoader className="TNUI-Chat-loader_loader" size="large" />
                                <span className="TNUI-Chat-loader_label">Загрузка</span>
                            </div>
                        )}
                        <MemoMessageInput
                            className="TNUI-Chat-message-input"
                            ref={messageInputRef}
                            isMessageSendInProgress={isMessageSendInProgress}
                            onSendButtonClick={sendButtonClickHandler}
                            onKeyDown={inputEnterKeyPressHandler}
                        />
                    </div>
                </>
            ) : (
                <span className="TNUI-Chat-no-open-chat-alert">
                    <NoOpenChatIcon className="TNUI-Chat-no-open-chat-alert_icon" />
                    <span className="TNUI-Chat-no-open-chat-alert_label">Ни один чат не открыт</span>
                </span>
            )}
        </div>
    );
}
