import "./ChatHeader.scss";

import MenuIcon from "@mui/icons-material/MoreVertOutlined";

import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";

import Avatar from "../../../shared/UI/Avatar";

interface ChatHeaderProps extends Omit<UiComponentProps<HTMLDivElement>, "children"> {
    // chat: Chat //TODO implement this
}

export default function ChatHeader(props: ChatHeaderProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-ChatHeader", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {/* TODO make it link */}
            <div className="TNUI-ChatHeader-chat-info">
                <Avatar className="TNUI-ChatHeader-chat-info_avatar" />
                <span className="TNUI-ChatHeader-chat-info_chat-name">Степан Ананьин</span>
            </div>
            <div className="TNUI-ChatHeader-chat-control">
                <MenuIcon className="TNUI-ChatHeader-chat-control_icon" />
            </div>
        </div>
    );
}
