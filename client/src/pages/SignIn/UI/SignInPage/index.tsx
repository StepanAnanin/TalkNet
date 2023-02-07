import "./SignInPage.scss";
import React from "react";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import { AuthForm } from "../../../../features/AuthForm";

export default function LoginPage() {
    return (
        <Page className="sign-in-page">
            <Header />
            <AuthForm className="sign-in-page-auth-form" />
        </Page>
    );
}
