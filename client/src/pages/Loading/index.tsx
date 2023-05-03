import "./LoadingPage.scss";
import Page from "../../shared/UI/Page";
import { UiComponentProps } from "../../shared/types/UI/UiComponentProps";
import Header from "../../widgets/Header";
import { SquareLoader } from "../../shared/UI/Loader";

interface LoadingPageProps extends UiComponentProps<HTMLDivElement> {
    hideHeader?: boolean;
}

export default function LoadingPage({ className = "", hideHeader = false, ...otherProps }: LoadingPageProps) {
    const classes = ["TNUI-LoadingPage", className].join(" ");

    return (
        <Page title="TalkNet | Загрузка..." className={classes} {...otherProps}>
            {!hideHeader && <Header hideSignInButton />}
            <div className="TNUI-LoadingPage-loader">
                <SquareLoader className="TNUI-LoadingPage-loader_spinner" size="large" />
                <label className="TNUI-LoadingPage-loader_label">Загрузка</label>
            </div>
        </Page>
    );
}
