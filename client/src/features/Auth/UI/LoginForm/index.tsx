import "./LoginForm.scss";
import React from "react";

import Logo from "../../../../shared/UI/Logo";
import Paper from "../../../../shared/UI/Paper";
import TextInput from "../../../../shared/UI/TextInput";
import Button from "../../../../shared/UI/Button";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import validateEmail from "../../../../shared/lib/validators/validateEmail";
import Alert from "../../../../shared/UI/Alert";
import Checkbox from "../../../../shared/UI/Checkbox";
import { DefaultLoader } from "../../../../shared/UI/Loader";
import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { login } from "../../model/store/actionCreators/authActions";

interface LoginFormProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function LoginForm({ className, style }: LoginFormProps) {
    const { request: authRequest } = useTypedSelector((state) => state.auth);
    const dispatch = useTypedDispatch();

    const [error, setError] = React.useState<string | null>(null);
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);

    // Updating alert state depending on authRequest
    React.useEffect(() => {
        if (authRequest.status === "failed" && authRequest.message && authRequest.message !== error) {
            setError(authRequest.message);
        }
    }, [authRequest]);

    const emailInputID = "LoginForm-form_email-input";
    const passwordInputID = "LoginForm-form_password-input";

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

        if (!emailValidationResult.OK) {
            setError(emailValidationResult.message!);
            return;
        }

        if (!passwordInputValue.replaceAll(" ", "")) {
            setError("Введите пароль");
            return;
        }

        await dispatch(login({ email: emailInputValue, password: passwordInputValue }));
    }

    function goBackButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        window.history.back();
    }

    function passwordDisplayControlCheckboxClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // Without this condition this handler will be called twice upon clicking label
        if (e.target instanceof HTMLInputElement) {
            setIsPasswordHidden((p) => !p);
        }
    }

    const classes = ["LoginForm", className ?? ""].join(" ");

    return (
        <Paper className={classes} style={style} colourShift={2}>
            <div className="LoginForm-header">
                <Logo className="LoginForm-header_logo" size="medium" />
                <span className="LoginForm-header_label">Вход</span>
            </div>
            {error && (
                <Alert className="LoginForm-alert" severity="Error" header="Ошибка">
                    {error}
                </Alert>
            )}
            <form className="LoginForm-form">
                <TextInput placeholder="E-Mail" className="LoginForm-form_input" id={emailInputID} />
                <TextInput
                    type={isPasswordHidden ? "password" : "text"}
                    placeholder="Пароль"
                    className="LoginForm-form_input"
                    id={passwordInputID}
                />
                <div className="LoginForm-form_block">
                    <Checkbox
                        checkboxId="LoginForm-form_password-display-control-checkbox"
                        onClick={passwordDisplayControlCheckboxClickHandler}
                        label={<span>Показать пароль</span>}
                    />
                    <Link to="/signup" className="LoginForm-form_sign-up-link">
                        Регистрация
                    </Link>
                </div>
                <div className="LoginForm-form_control">
                    <Button className="LoginForm-form_control-button" variant="outlined" onClick={goBackButtonClickHandler}>
                        НАЗАД
                    </Button>
                    <Button className="LoginForm-form_control-button" variant="contained" onClick={signInButtonClickHandler}>
                        {authRequest.status === "pending" ? (
                            <DefaultLoader size="small" spinnerColour="lightest-primary" />
                        ) : (
                            "ВХОД"
                        )}
                    </Button>
                </div>
            </form>
        </Paper>
    );
}
