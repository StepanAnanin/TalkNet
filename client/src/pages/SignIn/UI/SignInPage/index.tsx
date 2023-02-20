import "./SignInPage.scss";
import React from "react";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import { AuthForm } from "../../../../features/AuthForm";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
    const { user } = useTypedSelector((state) => state.auth);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <Page className="sign-in-page">
            <Header dontShowSignInButton />
            <AuthForm className="sign-in-page-auth-form" />
        </Page>
    );
}
