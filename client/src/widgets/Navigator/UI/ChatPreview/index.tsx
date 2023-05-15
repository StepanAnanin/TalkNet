import "./ChatPreview.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type DialogueChat from "../../../../shared/types/features/DialogueChat";

import Avatar from "../../../../shared/UI/Avatar";
import FormatedDate from "../../../../shared/lib/FormatedDate";
import NavigatorExplorerItem from "../NavigatorExplorerItem";

interface ChatProps extends Omit<UiComponentProps<HTMLAnchorElement>, "onClick"> {
    chatName: string;
    chat: DialogueChat;
    imgURL?: string;
    lastReadMessageIndex: number;
    active?: boolean;

    /**
     * If this props is passed then instead of using "imgURL" props to get image
     * will be displayed avatar of user with this specific id or placeholder (if user hasn't avatar or failed to get it).
     */
    interlocutorID?: string;
}

// TODO add icon if chat muted
export default function ChatPreview(props: ChatProps) {
    const {
        className = "",
        active = false,
        imgURL,
        interlocutorID,
        chatName,
        chat,
        lastReadMessageIndex,
        ...otherProps
    } = props;

    const lastMessage = chat.lastMessage;

    const formatedLastMessageSentDate = new FormatedDate(lastMessage.sentDate);
    const isLastMessageSentYesterday = FormatedDate.isYesterday(Date.now(), lastMessage.sentDate);
    const isLastMessageSentToday = new Date().getDay() === new Date(lastMessage.sentDate).getDay();

    const classes = ["TNUI-ChatPreview", active ? "TNUI-ChatPreview-active" : "", className].join(" ");

    return (
        <NavigatorExplorerItem
            to={"/n/m?chat=" + chat.id}
            className={classes}
            title={chatName}
            img={
                <Avatar
                    userID={chat.type === "dialogue" ? interlocutorID : undefined}
                    src={chat.type === "dialogue" ? undefined : imgURL}
                    className="TNUI-ChatPreview-avatar"
                    size="medium"
                />
            }
            {...otherProps}
        >
            <div className="TNUI-ChatPreview-top">
                {lastReadMessageIndex !== chat.messageAmount - 1 && (
                    <span className="TNUI-ChatPreview-top_unread-messages">
                        {chat.messageAmount - (lastReadMessageIndex + 1)}
                    </span>
                )}
                <span className="TNUI-ChatPreview-top_chat-name">{chatName}</span>
                <span className="TNUI-ChatPreview-top_last-message-sent-date">
                    {/* 
                                if (isLastMessageSentToday) {
                                    return formatedLastMessageSentDate.getTime();
                                }

                                if (isLastMessageSentYesterday) {
                                    return 'Вчера'
                                }

                                return formatedLastMessageSentDate.getDate()
                        */}
                    {isLastMessageSentToday
                        ? formatedLastMessageSentDate.getTime()
                        : isLastMessageSentYesterday
                        ? "Вчера"
                        : formatedLastMessageSentDate.getDate()}
                </span>
            </div>
            <span className="TNUI-ChatPreview_last-message">{lastMessage.data}</span>
        </NavigatorExplorerItem>
    );
}

export const MemoChatPreview = React.memo(ChatPreview);
