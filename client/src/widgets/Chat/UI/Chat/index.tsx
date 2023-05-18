import "./Chat.scss";
import React from "react";

import NoOpenChatIcon from "@mui/icons-material/ReviewsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type IChatMessage from "../../../../shared/types/entities/IChatMessage";

import ChatHeader from "../ChatHeader";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import MessengerServiceEventModel from "../../../../shared/types/shared/lib/MessengerService/MessengerServiceModel";
import {
    MessengerServiceIncomingEvent,
    MessengerServiceOutcomingEventResponse,
} from "../../../../shared/lib/MessengerService/MessengerServiceEvent";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { AxiosError } from "axios";
import { DoubledLoader } from "../../../../shared/UI/Loader";
import { MemoChatMessageInput } from "../../../../features/ChatMessageControl";
import getIsUserHasAccessToChat from "../../lib/getIsUserHasAccessToChat";
import parseChatMessages from "../../lib/parseChatMessages";
import useMessengerService from "../../../../shared/model/hooks/useMessengerService";

interface ChatProps extends UiComponentProps<HTMLDivElement> {
    MessengerServiceConnection: ReturnType<typeof useMessengerService>;
    chatID: string;
}

interface MessagesState {
    payload: IChatMessage[] | null;
    requestStatus: "Pending" | "Success" | "Error";
}

// TODO Fix overflow styles
// TODO try to get rid of excess renders
export default function Chat(props: ChatProps) {
    const { className = "", MessengerServiceConnection, chatID, ...otherProps } = props;

    const [userChats, user] = useTypedSelector((state) => [state.chatList.payload, state.auth.payload]);

    const [messages, setMessages] = React.useState<MessagesState>({ requestStatus: "Pending", payload: null });

    React.useEffect(() => {
        if (!chatID) {
            return;
        }

        if (userChats && chatID && !getIsUserHasAccessToChat(userChats, chatID)) {
            throw new Error(`У вас нет доступа к этому чату`);
        }

        // BUG now "e" has a problem with typesation
        function handleSendMessageResponse(
            e: MessengerServiceOutcomingEventResponse<MessengerServiceEventModel.OutcomingEvent.Response.Any>
        ) {
            const message = e.payload as IChatMessage;

            setMessages((p) => {
                return { ...p, payload: p.payload ? [message, ...p.payload] : [message] };
            });
        }

        function handleReceiveMessage(e: MessengerServiceIncomingEvent<MessengerServiceEventModel.IncomingEvent.Any>) {
            setMessages((p) => {
                return {
                    ...p,
                    payload: p.payload ? [e.payload as IChatMessage, ...p.payload] : [e.payload as IChatMessage],
                };
            });
        }

        MessengerServiceConnection.addEventHandler("send-message", handleSendMessageResponse);

        MessengerServiceConnection.addEventHandler("receive-message", handleReceiveMessage);

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

        return function () {
            MessengerServiceConnection.removeEventHandler("send-message", handleSendMessageResponse);
            MessengerServiceConnection.removeEventHandler("receive-message", handleReceiveMessage);
        };
    }, [chatID]);

    const classes = ["TNUI-Chat", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {userChats && <ChatHeader chat={userChats.find((chat) => chat.id === chatID)!} />}
            <div className="TNUI-Chat-content">
                {messages.requestStatus === "Success" &&
                    (messages.payload!.length > 0 ? (
                        <div className="TNUI-Chat-messages">
                            {parseChatMessages(messages.payload!, user!, MessengerServiceConnection, chatID)}
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
                <MemoChatMessageInput chatID={chatID} MessengerServiceConnection={MessengerServiceConnection} />
            </div>
        </div>
    );
}
