import "./ErrorPage404.scss";

import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import ErrorAlert404 from "../ErrorAlert404";

export default function ErrorPage404() {
    return (
        <Page title="Страница не найдена" className="TNUI-ErrorPage404">
            <Header />
            <div className="TNUI-ErrorPage404-content">
                <ErrorAlert404 />
            </div>
        </Page>
    );
}
