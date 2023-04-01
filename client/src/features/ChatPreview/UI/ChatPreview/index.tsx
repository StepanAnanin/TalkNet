import "./ChatPreview.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Avatar from "../../../../shared/UI/Avatar";
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";

interface ChatProps extends Omit<UiComponentProps<HTMLDivElement>, "onClick"> {
    imgURL: string;
    chatName: string;
    lastMessage: string;
    // lastMessageSentDate: number;
    active?: boolean;
    minified?: boolean;
}

// TODO Require improvements in minified mode
// TODO Add display of last message sent date
export default function ChatPreview(props: ChatProps) {
    const {
        className = "",
        active = false,
        minified = false,
        imgURL,
        chatName,
        lastMessage,
        // lastMessageSentDate,
        ...otherProps
    } = props;

    // const formatedLastMessageSentDate = new FormatedDate(lastMessageSentDate);

    const classes = [
        "TNUI-ChatPreview",
        minified ? "TNUI-ChatPreview-minified" : "",
        active ? "TNUI-ChatPreview-active" : "",
        className,
    ].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <Avatar src={imgURL} className="TNUI-ChatPreview-avatar" size="medium" />
            {!minified && (
                <div className="TNUI-ChatPreview-info">
                    <span className="TNUI-ChatPreview-info_chat-name">{chatName}</span>
                    <span className="TNUI-ChatPreview-info_last-message">{lastMessage}</span>
                </div>
            )}
        </div>
    );
}
