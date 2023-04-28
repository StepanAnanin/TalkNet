import "./ChatPreview.scss";
import React from "react";

import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";
import type DialogueChat from "../../../../../../shared/types/features/DialogueChat";

import Avatar from "../../../../../../shared/UI/Avatar";
import FormatedDate from "../../../../../../shared/lib/helpers/FormatedDate";
import NavigatorExplorerItem from "../../../../../../features/NavigatorExplorerItem";

interface ChatProps extends Omit<UiComponentProps<HTMLAnchorElement>, "onClick"> {
    imgURL: string;
    chatName: string;
    chat: DialogueChat;
    lastReadMessageIndex: number;
    active?: boolean;
}

// TODO add icon if chat muted
export default function ChatPreview(props: ChatProps) {
    const { className = "", active = false, imgURL, chatName, chat, lastReadMessageIndex, ...otherProps } = props;

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
            img={<Avatar src={imgURL} className="TNUI-ChatPreview-avatar" size="medium" />}
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
