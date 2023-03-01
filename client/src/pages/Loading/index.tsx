import "./LoadingPage.scss";
import Page from "../../shared/UI/Page";
import { UiComponentProps } from "../../shared/types/UI/UiComponentProps";
import Header from "../../widgets/Header";
import { DoubledLoader } from "../../shared/UI/Loader";

interface LoadingPageProps extends UiComponentProps<HTMLDivElement> {
    //
}

export default function LoadingPage({ className = "", ...otherProps }: LoadingPageProps) {
    const classes = ["TNUI-LoadingPage", className].join(" ");

    return (
        <Page className={classes} {...otherProps}>
            <Header hideSignInButton />
            <div className="TNUI-LoadingPage-loader">
                <DoubledLoader className="TNUI-LoadingPage-loader_spinner" size="large" />
                <label className="TNUI-LoadingPage-loader_label">Загрузка</label>
            </div>
        </Page>
    );
}
