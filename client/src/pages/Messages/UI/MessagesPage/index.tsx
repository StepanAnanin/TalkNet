import "./MessagesPage.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import { Navigate } from "react-router-dom";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import ChatExplorer from "../ChatExplorer";
import Chat from "../../../../widgets/Chat";

interface MessagesPageProps extends UiComponentProps<HTMLDivElement> {
    //
}

// TODO create an additional layout for this type of pages.
export default function MessagesPage(props: MessagesPageProps) {
    const { className = "", ...otherProps } = props;

    const { user } = useTypedSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const classes = ["TNUI-MessagesPage", className].join(" ");

    return (
        <Page title="TalkNet | Сообщения" className={classes} {...otherProps}>
            <Header />
            <div className="TNUI-MessagesPage-content">
                <ChatExplorer />
                <Chat />
            </div>
        </Page>
    );
}
