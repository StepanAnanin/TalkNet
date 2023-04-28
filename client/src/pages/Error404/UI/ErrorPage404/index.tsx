import "./ErrorPage404.scss";

import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import ErrorAlert404 from "../ErrorAlert404";

interface ErrorPage404Props {
    hideHeader?: boolean;
}

export default function ErrorPage404({ hideHeader = false }: ErrorPage404Props) {
    return (
        <Page title="Страница не найдена" className="TNUI-ErrorPage404">
            {!hideHeader && <Header />}
            <div className="TNUI-ErrorPage404-content">
                <ErrorAlert404 />
            </div>
        </Page>
    );
}
