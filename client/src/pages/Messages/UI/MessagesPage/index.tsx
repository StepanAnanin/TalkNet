import "./MessagesPage.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Page from "../../../../shared/UI/Page";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import Chat from "../../../../widgets/Chat";
import NavigatorLayout from "../../../UI/layouts/NavigatorLayout";

interface MessagesPageProps extends UiComponentProps<HTMLDivElement> {
    //
}

// TODO create an additional layout for this type of pages.
export default function MessagesPage(props: MessagesPageProps) {
    const { className = "", ...otherProps } = props;

    const { user } = useTypedSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const chatID = searchParams.get("chat");
    const classes = ["TNUI-MessagesPage", className].join(" ");

    return (
        <Page title="TalkNet | Сообщения" className={classes} {...otherProps}>
            <NavigatorLayout closed={!chatID}>
                <Chat chatID={chatID} />
            </NavigatorLayout>
        </Page>
    );
}
