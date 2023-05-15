import "./ChatMessage.scss";
import React from "react";

import SentIcon from "@mui/icons-material/DoneOutlined";
import SentAndReadIcon from "@mui/icons-material/DoneAllOutlined";
import FailedToSendIcon from "@mui/icons-material/CancelOutlined";

import type IChatMessage from "../../shared/types/entities/IChatMessage";
import type { UiComponentProps } from "../../shared/types/UI/UiComponentProps";

import FormatedDate from "../../shared/lib/FormatedDate";

interface DialogueMessageProps extends UiComponentProps<HTMLDivElement> {
    sender: "user" | "interlocutor";
    message: IChatMessage;
    sendError?: boolean;
}

const ChatMessage = React.forwardRef(function ChatMessage(
    { className = "", message, sender, sendError = false, ...otherProps }: DialogueMessageProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const classes = [
        "TNUI-ChatMessage",
        "TNUI-ChatMessage-send-by-" + sender,
        message.readDate ? "" : "TNUI-ChatMessage-unread",
        className,
    ].join(" ");

    const formatedSentDate = new FormatedDate(message.sentDate);

    return (
        <div ref={ref} className={classes} {...otherProps}>
            {sender === "interlocutor" && <div className="TNUI-ChatMessage-offside-shape" />}
            <div className="TNUI-ChatMessage-body">
                <p className="TNUI-ChatMessage-text">
                    {message.data}
                    {message.edited && (
                        <>
                            &nbsp;
                            <span className="TNUI-ChatMessage-text_changed-alert">(ред.)</span>
                        </>
                    )}
                </p>
                <div className="TNUI-ChatMessage-info">
                    <span className="TNUI-ChatMessage-status">
                        {/* 
                            Construction below equal to this:

                            if (sendError){
                                return <FailedToSendIcon ...>;
                            }

                            return message.readDate ? <SentAndReadIcon ...> : <SentIcon ...>;
                        */}
                        {sendError ? (
                            <FailedToSendIcon
                                className="TNUI-ChatMessage-status_failed-img"
                                titleAccess="Не удалось отправить сообщение"
                            />
                        ) : message.readDate ? (
                            <SentAndReadIcon
                                className="TNUI-ChatMessage-status_success-img"
                                titleAccess="Сообщение прочитано"
                            />
                        ) : (
                            <SentIcon className="TNUI-ChatMessage-status_success-img" titleAccess="Сообщение не прочитано" />
                        )}
                    </span>
                    <span className="TNUI-ChatMessage-send-date">{formatedSentDate.getTime()}</span>
                </div>
            </div>
            {sender === "user" && <div className="TNUI-ChatMessage-offside-shape" />}
        </div>
    );
});

export default ChatMessage;

export const MemoChatMessage = React.memo(ChatMessage);
