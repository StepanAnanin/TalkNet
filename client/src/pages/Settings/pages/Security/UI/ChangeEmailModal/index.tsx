import "./ChangeEmailModal.scss";
import React from "react";

import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";
import type ChangeRequest from "../../../../../../shared/types/pages/settings/ChangeRequest";

import { CustomModal } from "../../../../../../features/Modal";
import TextInput from "../../../../../../shared/UI/TextInput";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import Alert from "../../../../../../shared/UI/Alert";
import { useTypedDispatch } from "../../../../../../shared/model/hooks/useTypedDispatch";
import { logout } from "../../../../../../features/Auth/model/store/actionCreators/authActions";

interface ChangeEmailModalProps extends UiComponentProps<HTMLDivElement> {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function ChangeEmailModal(props: ChangeEmailModalProps) {
    const { className = "", openState, ...otherProps } = props;

    const dispatch = useTypedDispatch();

    const [request, setRequest] = React.useState<ChangeRequest | null>(null);
    const [isOpen, setIsOpen] = openState;

    const emailInputRef = React.useRef<HTMLInputElement | null>(null);
    const passwordInputRef = React.useRef<HTMLInputElement | null>(null);

    async function closeButtonClickHander() {
        if (request?.status === "Success") {
            await dispatch(logout());

            // This is not a bug or mistake, page should be reloaded.
            window.location.pathname = "/signin";
        }

        setIsOpen(false);
    }

    async function confirmButtonClickHandler() {
        const emailInputElement = emailInputRef.current;
        const passwordInputElement = passwordInputRef.current;

        if (!(emailInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find emailInputElement");
        }

        if (!(passwordInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find passwordInputElement");
        }

        const inputedEmail = emailInputElement.value;
        const inputedPassword = passwordInputElement.value;

        if (!inputedEmail || !inputedPassword) {
            return;
        }

        setRequest({
            message: null,
            status: "Pending",
        });

        try {
            await TalkNetAPI.patch("/user/change/email", {
                newEmail: inputedEmail,
                password: inputedPassword,
            });

            setRequest({
                status: "Success",
                message: "E-Mail успешно изменён",
            });
        } catch (err) {
            if (!(err instanceof AxiosError)) {
                throw err;
            }

            console.log(err);

            const errorMessage = err.response!.data.message;

            setRequest({
                status: "Error",
                message:
                    (errorMessage ?? "Во время запроса на сервер произошла ошибка") +
                    ` (код ошибки ${err.response!.status})`,
            });
        }
    }

    const classes = ["TNUI-ChangeEmailModal TNUI-SettingsPage-modal", className ?? ""].join(" ");

    return (
        <>
            {isOpen && (
                <CustomModal
                    className={classes}
                    header="Смена E-Mail'а"
                    setIsOpen={setIsOpen}
                    onClose={closeButtonClickHander}
                    onConfirm={confirmButtonClickHandler}
                    hideCloseIcon
                    hideConfirmButton={request?.status === "Success"}
                    dontCloseOnClickAway
                    {...otherProps}
                >
                    {request && request.status !== "Pending" && (
                        <Alert
                            className="TNUI-ChangeEmailModal-alert"
                            severity={request.status}
                            header={request.status === "Error" ? "Ошибка" : "Успех"}
                            hideIcon
                        >
                            {request.message}
                        </Alert>
                    )}
                    {request?.status !== "Success" && (
                        <>
                            <p className="TNUI-SettingsPage-modal-info">
                                Введите новый E-Mail и текущий пароль в поля снизу и нажмите на кнопку "Подтвердить".
                                <br />
                                После этого на ваш текущий E-Mail будет отправленно письмо с ссылкой, перейдите по ней для
                                подтверждения смены E-Mail'а.
                            </p>
                            <TextInput
                                className="TNUI-ChangeEmailModal-new-email-input"
                                placeholder="Новый E-Mail"
                                ref={emailInputRef}
                            />
                            <TextInput
                                className="TNUI-ChangeEmailModal-password-input"
                                placeholder="Пароль"
                                type="password"
                                ref={passwordInputRef}
                            />
                            <p className="TNUI-SettingsPage-modal-info">
                                После смены E-Mail'а подтребуется повторная активация аккаунта.
                            </p>
                        </>
                    )}
                </CustomModal>
            )}
        </>
    );
}
