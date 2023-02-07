import "./SignUpPage.scss";
import Page from "../../../../shared/UI/Page";
import Header from "../../../../widgets/Header";
import UserRegistrationForm from "../UserRegistrationForm";

export default function SignUpPage() {
    return (
        <Page className="sign-up-page" title="TalkNet | Регистрация">
            <Header />
            <UserRegistrationForm className="sign-up-page-registration-form" />
        </Page>
    );
}
