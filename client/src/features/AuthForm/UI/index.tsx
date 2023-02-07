import "./AuthForm.scss";
import { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import Logo from "../../../shared/UI/Logo";
import Paper from "../../../shared/UI/Paper";
import TextInput from "../../../shared/UI/TextInput";
import Button from "../../../shared/UI/Button";
import { Link } from "react-router-dom";

interface AuthFormProps extends UiComponentProps<HTMLFormElement> {
    //
}

export default function AuthForm(props: AuthFormProps) {
    const { className } = props;

    function signInButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        console.log(Date.now());
    }

    // TODO need to test, maybe now it's ruin SPA principe
    function goBackButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        window.history.back();
    }

    const classes = ["AuthForm", className ?? ""].join(" ");

    return (
        <Paper className={classes} colourShift={2}>
            <div className="AuthForm-header">
                <Logo className="AuthForm-header_logo" size="medium" />
                <span className="AuthForm-header_label">Вход</span>
            </div>
            <form className="AuthForm-form">
                <TextInput
                    placeholder="E-Mail"
                    className="AuthForm-form_input"
                    id="AuthForm-form_email-input"
                    size="large"
                />
                <TextInput
                    type="password"
                    placeholder="Пароль"
                    className="AuthForm-form_input"
                    id="AuthForm-form_password-input"
                    size="large"
                />
                <Link to="/signup" className="AuthForm-form_sign-up-link">
                    Регистрация
                </Link>
                <div className="AuthForm-form_control">
                    <Button variant="outlined" size="large" onClick={goBackButtonClickHandler}>
                        НАЗАД
                    </Button>
                    <Button variant="contained" size="large" onClick={signInButtonClickHandler}>
                        ВХОД
                    </Button>
                </div>
            </form>
        </Paper>
    );
}
