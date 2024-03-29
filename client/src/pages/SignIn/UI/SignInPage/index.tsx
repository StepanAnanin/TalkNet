import "./SignInPage.scss";
import React from "react";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../../../../features/Auth";

export default function LoginPage() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <Page className="sign-in-page" title="TalkNet | Вход">
            <Header hideSignInButton />
            <LoginForm className="sign-in-page-login-form" />
        </Page>
    );
}
