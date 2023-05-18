import "./MessagesPage.scss";

import NoOpenChatIcon from "@mui/icons-material/ReviewsRounded";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import { Navigate, useSearchParams } from "react-router-dom";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import Chat from "../../../../widgets/Chat";
import useMessengerService from "../../../../shared/model/hooks/useMessengerService";

interface MessagesPageProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function MessagesPage(props: MessagesPageProps) {
    const { className = "", ...otherProps } = props;

    const { payload: user } = useTypedSelector((state) => state.auth);

    const MessengerServiceConnection = useMessengerService();
    const [searchParams] = useSearchParams();

    const chatID = searchParams.get("chat");

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const classes = ["TNUI-MessagesPage", className].join(" ");

    // TODO need to add navigator closing and opening
    return (
        <Page title="TalkNet | Сообщения" className={classes} {...otherProps}>
            {chatID ? (
                <Chat chatID={chatID} MessengerServiceConnection={MessengerServiceConnection} />
            ) : (
                <span className="TNUI-MessagesPage-no-open-chat-alert">
                    <NoOpenChatIcon className="TNUI-MessagesPage-no-open-chat-alert_icon" />
                    <span className="TNUI-MessagesPage-no-open-chat-alert_label">Ни один чат не открыт</span>
                </span>
            )}
        </Page>
    );
}
