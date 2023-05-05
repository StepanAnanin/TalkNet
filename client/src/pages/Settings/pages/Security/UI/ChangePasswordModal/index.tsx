import "./ChangePasswordModal.scss";
import React from "react";

import type ChangeRequest from "../../../../../../shared/types/pages/settings/ChangeRequest";
import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";

import { CustomModal } from "../../../../../../features/Modal";
import TextInput from "../../../../../../shared/UI/TextInput";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import Alert from "../../../../../../shared/UI/Alert";
import Checkbox from "../../../../../../shared/UI/Checkbox";

interface ChangePasswordModalProps extends UiComponentProps<HTMLDivElement> {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function ChangePasswordModal(props: ChangePasswordModalProps) {
    const { className = "", openState, ...otherProps } = props;

    const [request, setRequest] = React.useState<ChangeRequest | null>(null);
    const [isPasswordsShown, setIsPasswordsShown] = React.useState(false);
    const [isOpen, setIsOpen] = openState;

    const currentPasswordInputRef = React.useRef<HTMLInputElement | null>(null);
    const newPasswordInputRef = React.useRef<HTMLInputElement | null>(null);

    function closeButtonClickHander() {
        setIsOpen(false);

        if (request?.status === "Success") {
            window.location.reload();
        }
    }

    function togglePasswordShow() {
        setIsPasswordsShown((p) => !p);
    }

    async function confirmButtonClickHandler() {
        const currentPasswordInputElement = currentPasswordInputRef.current;
        const newPasswordInputElement = newPasswordInputRef.current;

        if (!(currentPasswordInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find currentPasswordInputElement");
        }

        if (!(newPasswordInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find newPasswordInputElement");
        }

        const inputedCurrentPassword = currentPasswordInputElement.value;
        const inputedNewPassword = newPasswordInputElement.value;

        if (!inputedCurrentPassword || !inputedNewPassword) {
            return;
        }

        setRequest({
            message: null,
            status: "Pending",
        });

        try {
            await TalkNetAPI.patch("/user/change/password", {
                newPassword: inputedNewPassword,
                currentPassword: inputedCurrentPassword,
            });

            setRequest({
                status: "Success",
                message: "Пароль успешно изменён",
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

    const classes = ["TNUI-ChangePasswordModal TNUI-SettingsPage-modal", className ?? ""].join(" ");

    return (
        <>
            {isOpen && (
                <CustomModal
                    className={classes}
                    header="Смена пароля"
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
                            className="TNUI-ChangePasswordModal-alert"
                            severity={request.status}
                            header={request.status === "Error" ? "Ошибка" : "Успех"}
                            hideIcon
                        >
                            {request.message}
                        </Alert>
                    )}
                    {request?.status !== "Success" && (
                        <>
                            <TextInput
                                className="TNUI-ChangePasswordModal-password-input"
                                placeholder="Текущий пароль"
                                type={!isPasswordsShown ? "password" : "text"}
                                ref={currentPasswordInputRef}
                            />
                            <TextInput
                                className="TNUI-ChangePasswordModal-password-input"
                                placeholder="Новый пароль"
                                type={!isPasswordsShown ? "password" : "text"}
                                ref={newPasswordInputRef}
                            />
                            <Checkbox
                                className="TNUI-ChangePasswordModal-show-password-checkbox"
                                checkboxId="change-password-modal-show-password-checkbox"
                                label="Показать пароли"
                                onChange={togglePasswordShow}
                            />
                        </>
                    )}
                </CustomModal>
            )}
        </>
    );
}
