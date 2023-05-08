import "./ChatHeader.scss";

import MenuIcon from "@mui/icons-material/MoreVertOutlined";

import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import type DialogueChat from "../../../shared/types/features/DialogueChat";

import Avatar from "../../../shared/UI/Avatar";
import { useTypedSelector } from "../../../shared/model/hooks/useTypedSelector";

interface ChatHeaderProps extends Omit<UiComponentProps<HTMLDivElement>, "children"> {
    chat: DialogueChat;
}

export default function ChatHeader(props: ChatHeaderProps) {
    const { className = "", chat, ...otherProps } = props;

    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Необходима авторизация");
    }

    const interlocutor = chat.members.find((member) => member.userID !== user.id);

    if (!interlocutor) {
        throw new Error("Не удалось получать данные о собеседнике");
    }

    const classes = ["TNUI-ChatHeader", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <div className="TNUI-ChatHeader-chat-info">
                <Avatar userID={interlocutor.userID} className="TNUI-ChatHeader-chat-info_avatar" />
                <span className="TNUI-ChatHeader-chat-info_chat-name">{interlocutor.fullUserName}</span>
            </div>
            <div className="TNUI-ChatHeader-chat-control">
                <MenuIcon className="TNUI-ChatHeader-chat-control_icon" />
            </div>
        </div>
    );
}
