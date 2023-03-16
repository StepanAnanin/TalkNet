import "./UserRegistrationForm.scss";
import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import React from "react";
import Logo from "../../../../shared/UI/Logo";
import TextInput from "../../../../shared/UI/TextInput";
import Checkbox from "../../../../shared/UI/Checkbox";
import { Link } from "react-router-dom";
import Button from "../../../../shared/UI/Button";
import Paper from "../../../../shared/UI/Paper";
import Alert from "../../../../shared/UI/Alert";
import validateSignUpForm from "../../lib/validators/validateSignUpForm";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../shared/api/TalkNetAPI";
import { DefaultLoader } from "../../../../shared/UI/Loader";

interface UserRegistrationFormProps extends UiComponentProps<HTMLFormElement> {
    //
}

export interface IinputIds {
    name: string;
    surname: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

type AlertType = "Error" | "Success";

// TODO add captcha
// BUG load button has UI bug
// BUG Missing patronymic input
export default function UserRegistrationForm(props: UserRegistrationFormProps) {
    const { className, ...otherProps } = props;

    const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
    const [alertType, setAlertType] = React.useState<AlertType>("Error");
    const [isTermsAccepted, setIsTermsAccepted] = React.useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    const inputIds: IinputIds = {
        name: "UserRegistrationForm-name-input",
        surname: "UserRegistrationForm-surname-input",
        email: "UserRegistrationForm-email-input",
        password: "UserRegistrationForm-password-input",
        passwordRepeat: "UserRegistrationForm-password-repeat-input",
    } as const;

    async function confirmRegistrationButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        try {
            setIsLoading(true);

            const formValidationResult = validateSignUpForm(inputIds);

            if (!formValidationResult.OK) {
                alertType !== "Error" && setAlertType("Error");
                setAlertMessage(formValidationResult.message);
                return;
            }

            const inputedPassword = document.querySelector<HTMLInputElement>(`#${inputIds.password}`)!.value;
            const inputedEmail = document.querySelector<HTMLInputElement>(`#${inputIds.email}`)!.value;
            const inputedName = document.querySelector<HTMLInputElement>(`#${inputIds.name}`)!.value;
            let inputedSurname: string | null = document.querySelector<HTMLInputElement>(`#${inputIds.surname}`)!.value;

            // Reseting inputedSurname if user entered it equal to empty space.
            if (!inputedSurname.replaceAll(" ", "")) {
                inputedSurname = null;
            }

            await TalkNetAPI.post("/user/sign-up", {
                // TODO change this
                userName: inputedName,
                name: inputedName,
                surname: inputedSurname,
                email: inputedEmail,
                password: inputedPassword,
            });

            setIsLoading(false);
            setAlertType("Success");
            setAlertMessage(
                "Мы отправили письмо на указанный при регистрации адрес электронной почты, для подтверждения регистрации перейдите по ссылке, указанной в письме."
            );
        } catch (err) {
            if (err instanceof AxiosError) {
                alertType !== "Error" && setAlertType("Error");
                setAlertMessage(
                    err.response?.data.message ??
                        "Во время запроса на сервер произошла неуточнённая ошибка. Код: " + err.response?.status
                );
                return;
            }

            // Error boundary will catch this
            throw err;
        }
    }

    function goBackButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        window.history.back();
    }

    function termsAcceptionCheckboxClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // Without this condition this handler will be called twice upon clicking label
        if (e.target instanceof HTMLInputElement) {
            setIsTermsAccepted((p) => !p);
        }
    }

    function passwordDisplayControlCheckboxClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // Without this condition this handler will be called twice upon clicking label
        if (e.target instanceof HTMLInputElement) {
            setIsPasswordHidden((p) => !p);
        }
    }

    const classes = ["UserRegistrationForm", className ?? ""].join(" ");

    return (
        <Paper className={classes} colourShift={2}>
            <div className="UserRegistrationForm-header">
                <Logo className="UserRegistrationForm-header_logo" size="medium" />
                <span className="UserRegistrationForm-header_label">Регистрация</span>
            </div>
            {alertMessage && (
                <Alert
                    className="UserRegistrationForm-alert"
                    severity={alertType}
                    header={alertType === "Error" ? "Ошибка" : "Регистрация успешна"}
                >
                    {alertMessage}
                </Alert>
            )}
            {alertType !== "Success" && (
                <form {...otherProps}>
                    <div className="UserRegistrationForm-input-block">
                        <TextInput id={inputIds.name} className="UserRegistrationForm-input" placeholder="Имя" required />
                        <TextInput id={inputIds.surname} className="UserRegistrationForm-input" placeholder="Фамилия" />
                    </div>
                    <TextInput id={inputIds.email} className="UserRegistrationForm-input" placeholder="E-Mail" required />
                    <div className="UserRegistrationForm-input-block">
                        <TextInput
                            id={inputIds.password}
                            className="UserRegistrationForm-input"
                            placeholder="Пароль"
                            type={isPasswordHidden ? "password" : "text"}
                            required
                        />
                        <TextInput
                            id={inputIds.passwordRepeat}
                            className="UserRegistrationForm-input"
                            placeholder="Повторите пароль"
                            type={isPasswordHidden ? "password" : "text"}
                            required
                        />
                    </div>
                    <Checkbox
                        id="UserRegistrationForm-password-display-checkbox"
                        onClick={passwordDisplayControlCheckboxClickHandler}
                        label={<span>Показать пароль</span>}
                    />
                    <Checkbox
                        className="UserRegistrationForm-accept-terms"
                        checkboxId="UserRegistrationForm-accept-terms-checkbox"
                        onClick={termsAcceptionCheckboxClickHandler}
                        // TODO Update links when this pages will be added
                        label={
                            <span>
                                Я соглашаюсь с{" "}
                                <Link to="#" className="clear-link primary-text">
                                    условиями использования сервиса
                                </Link>{" "}
                                и{" "}
                                <Link to="#" className="clear-link primary-text">
                                    политикой конфиденциальности
                                </Link>
                            </span>
                        }
                    />
                    <p className="UserRegistrationForm-note">
                        Дополнительную информацию о себе вы можете указать после завершения регистрации.
                        <br />
                        Поля отмеченные "<span className="red-text">*</span>" обязательны для заполнения.
                    </p>
                </form>
            )}
            <div className="UserRegistrationForm-control">
                <Button
                    className="UserRegistrationForm-control_button"
                    variant="outlined"
                    onClick={goBackButtonClickHandler}
                >
                    Назад
                </Button>
                {alertType !== "Success" ? (
                    <Button
                        className="UserRegistrationForm-control_button"
                        variant="contained"
                        onClick={confirmRegistrationButtonClickHandler}
                        disabled={!isTermsAccepted}
                    >
                        {isLoading ? <DefaultLoader size="small" /> : "Подтвердить"}
                    </Button>
                ) : (
                    <Link to="/signin">
                        <Button className="UserRegistrationForm-control_button" variant="contained">
                            Вход
                        </Button>
                    </Link>
                )}
            </div>
        </Paper>
    );
}
