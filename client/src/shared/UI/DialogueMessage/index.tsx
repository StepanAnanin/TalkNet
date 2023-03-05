import "./DialogueMessage.scss";

import SentIcon from "@mui/icons-material/DoneOutlined";
import SentAndReadIcon from "@mui/icons-material/DoneAllOutlined";
import FailedToSendIcon from "@mui/icons-material/CancelOutlined";

import type { UiComponentProps } from "../../types/UI/UiComponentProps";

interface DialogueMessageProps extends UiComponentProps<HTMLDivElement> {
    sender: "user" | "interlocutor";
    read: boolean;
    changed?: boolean;
    sendError?: boolean;
    senderName?: string; //Not implemented
    sendDate?: number; // or already parsed string??
}

export default function DialogueMessage(props: DialogueMessageProps) {
    const { className = "", sender, read = false, sendError = false, changed = false, children, ...otherProps } = props;

    const classes = [
        "TNUI-DialogueMessage",
        "TNUI-DialogueMessage-send-by-" + sender,
        read ? "" : "TNUI-DialogueMessage-unread",
        className,
    ].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-DialogueMessage-body">
                <p className="TNUI-DialogueMessage-text">
                    {children}
                    {changed && (
                        <>
                            &nbsp;
                            <span className="TNUI-DialogueMessage-text_changed-alert">(ред.)</span>
                        </>
                    )}
                </p>
                <div className="TNUI-DialogueMessage-info">
                    <span className="TNUI-DialogueMessage-status">
                        {/* 
                            Construction below equal to this:

                            if (sendError){
                                return <FailedToSendIcon ...>;
                            }

                            return read ? <SentAndReadIcon ...> : <SentIcon ...>;
                        */}
                        {sendError ? (
                            <FailedToSendIcon
                                className="TNUI-DialogueMessage-status_failed-img"
                                titleAccess="Не удалось отправить сообщение"
                            />
                        ) : read ? (
                            <SentAndReadIcon
                                className="TNUI-DialogueMessage-status_success-img"
                                titleAccess="Сообщение прочитано"
                            />
                        ) : (
                            <SentIcon
                                className="TNUI-DialogueMessage-status_success-img"
                                titleAccess="Сообщение не прочитано"
                            />
                        )}
                    </span>
                    <span className="TNUI-DialogueMessage-send-date">08:00</span>
                </div>
            </div>
        </div>
    );
}
