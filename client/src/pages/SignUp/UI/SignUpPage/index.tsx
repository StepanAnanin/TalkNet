import "./SignUpPage.scss";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import UserRegistrationForm from "../UserRegistrationForm";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { Navigate } from "react-router-dom";

export default function SignUpPage() {
    const { user } = useTypedSelector((state) => state.auth);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <Page className="sign-up-page" title="TalkNet | Регистрация">
            <Header hideSignInButton />
            <UserRegistrationForm className="sign-up-page-registration-form" />
        </Page>
    );
}
