import "./ErrorPage.scss";
import React from "react";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import CriticalErrorAlert from "../CriticalErrorAlert";

interface ErrorPageProps {
    message: string;
    hideHeader?: boolean;
}

export default function ErrorPage({ message, hideHeader = false }: ErrorPageProps) {
    return (
        <Page className="TNUI-ErrorPage">
            {!hideHeader && <Header />}
            <div className="TNUI-ErrorPage-content">
                <CriticalErrorAlert message={message} />
            </div>
        </Page>
    );
}
