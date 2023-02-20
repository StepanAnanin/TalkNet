import "./AuthForm.scss";
import React from "react";
import Logo from "../../../shared/UI/Logo";
import Paper from "../../../shared/UI/Paper";
import TextInput from "../../../shared/UI/TextInput";
import Button from "../../../shared/UI/Button";
import { Link } from "react-router-dom";
import { addLogin } from "../../../entities/User";
import { useTypedDispatch } from "../../../shared/model/hooks/useTypedDispatch";
import { useTypedSelector } from "../../../shared/model/hooks/useTypedSelector";
import validateEmail from "../../../shared/lib/validators/validateEmail";
import validatePassword from "../../../pages/SignUp/lib/validators/validatePassword";

interface AuthFormProps {
    className?: string;
    style?: React.CSSProperties;
}

interface alertState {
    message: string;
    status: "error" | "warning";
}

export default function AuthForm({ className, style }: AuthFormProps) {
    const { request: authRequest } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

    const [alert, setAlert] = React.useState<alertState | null>(null);

    // Updating alert state depending on authRequest
    React.useEffect(() => {
        if (authRequest.status === "failed" && authRequest.message && authRequest.message !== alert?.message) {
            setAlert({ message: authRequest.message, status: "error" });
        }
    }, [authRequest]);

    const emailInputID = "AuthForm-form_email-input";
    const passwordInputID = "AuthForm-form_password-input";

    async function signInButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        const emailInputElement = document.querySelector(`#${emailInputID}`);
        const passwordInputElement = document.querySelector(`#${passwordInputID}`);

        if (!(emailInputElement instanceof HTMLInputElement) || !(passwordInputElement instanceof HTMLInputElement)) {
            throw new TypeError(`Email or password input wasn't found or has incorrect type`);
        }

        const emailInputValue = emailInputElement.value;
        const passwordInputValue = passwordInputElement.value;

        const emailValidationResult = validateEmail(emailInputValue);
        const passwordValidationResult = validatePassword(passwordInputValue);

        if (!emailValidationResult.OK) {
            setAlert({ message: emailValidationResult.message!, status: "warning" });
            return;
        }

        if (!passwordValidationResult.OK) {
            setAlert({ message: passwordValidationResult.message!, status: "warning" });
            return;
        }

        dispatch(addLogin(emailInputValue, passwordInputValue));
    }

    async function goBackButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        window.history.back();
    }

    const classes = ["AuthForm", className ?? ""].join(" ");

    return (
        <Paper className={classes} style={style} colourShift={2}>
            <div className="AuthForm-header">
                <Logo className="AuthForm-header_logo" size="medium" />
                <span className="AuthForm-header_label">Вход</span>
            </div>
            {alert && (
                <div className="AuthForm-alert" style={{ color: "red" }}>
                    {alert.message}
                </div>
            )}
            <form className="AuthForm-form">
                <TextInput placeholder="E-Mail" className="AuthForm-form_input" id={emailInputID} size="large" />
                <TextInput
                    type="password"
                    placeholder="Пароль"
                    className="AuthForm-form_input"
                    id={passwordInputID}
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
