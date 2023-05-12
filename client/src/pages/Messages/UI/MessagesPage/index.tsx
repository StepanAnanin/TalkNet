import "./MessagesPage.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import { Navigate, useSearchParams } from "react-router-dom";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import Chat from "../../../../widgets/Chat";
import NavigatorLayout from "../../../UI/layouts/NavigatorLayout";

interface MessagesPageProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function MessagesPage(props: MessagesPageProps) {
    const { className = "", ...otherProps } = props;

    const { payload: user } = useTypedSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const chatID = searchParams.get("chat");
    const classes = ["TNUI-MessagesPage", className].join(" ");

    // TODO need to add navigator closing and opening
    return (
        <Page title="TalkNet | Сообщения" className={classes} {...otherProps}>
            <Chat chatID={chatID} />
        </Page>
    );
}
