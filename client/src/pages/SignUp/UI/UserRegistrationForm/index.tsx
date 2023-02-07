import "./UserRegistrationForm.scss";
import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import React from "react";
import Logo from "../../../../shared/UI/Logo";
import TextInput from "../../../../shared/UI/TextInput";
import { useNavigate } from "react-router";
import Checkbox from "../../../../shared/UI/Checkbox";
import { Link } from "react-router-dom";
import Button from "../../../../shared/UI/Button";

interface UserRegistrationFormProps extends UiComponentProps<HTMLFormElement> {
    //
}

export default function UserRegistrationForm(props: UserRegistrationFormProps) {
    const { className, ...otherProps } = props;
    const navigate = useNavigate();

    function confirmRegistrationButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
    }

    function goBackButtonClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        navigate(-1);
    }

    const classes = ["UserRegistrationForm", className ?? ""].join(" ");

    return (
        <form className={classes} {...otherProps}>
            <div className="UserRegistrationForm-header">
                <Logo className="UserRegistrationForm-logo" size="medium" />
                <span className="UserRegistrationForm-label">Регистрация</span>
            </div>
            <TextInput className="UserRegistrationForm-input" size="large" placeholder="Имя пользователя" />
            <TextInput className="UserRegistrationForm-input" size="large" placeholder="E-Mail" />
            <TextInput className="UserRegistrationForm-input" size="large" placeholder="Пароль" type="password" />
            <TextInput className="UserRegistrationForm-input" size="large" placeholder="Повторите пароль" type="password" />
            <Checkbox
                className="UserRegistrationForm-accept-terms"
                checkboxId="UserRegistrationForm-accept-terms-checkbox"
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
            <div className="UserRegistrationForm-control">
                <Button variant="outlined" size="large" onClick={goBackButtonClickHandler}>
                    Назад
                </Button>
                <Button variant="contained" size="large" onClick={confirmRegistrationButtonClickHandler}>
                    Подтвердить
                </Button>
            </div>
        </form>
    );
}
