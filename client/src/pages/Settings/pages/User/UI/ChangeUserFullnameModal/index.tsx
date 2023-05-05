import "./ChangeUserFullnameModal.scss";
import React from "react";

import type ChangeRequest from "../../../../../../shared/types/pages/settings/ChangeRequest";
import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";
import type User from "../../../../../../shared/types/entities/User";

import { CustomModal } from "../../../../../../features/Modal";
import TextInput from "../../../../../../shared/UI/TextInput";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import Alert from "../../../../../../shared/UI/Alert";

interface ChangeUserFullnameModalProps extends UiComponentProps<HTMLDivElement> {
    user: User;
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

// TODO need to decompose all settings page modals requests
export default function ChangeUserFullnameModal(props: ChangeUserFullnameModalProps) {
    const { className = "", user, openState, ...otherProps } = props;

    const [request, setRequest] = React.useState<ChangeRequest | null>(null);
    const [isOpen, setIsOpen] = openState;

    const surnameInputRef = React.useRef<HTMLInputElement | null>(null);
    const nameInputRef = React.useRef<HTMLInputElement | null>(null);
    const patronymicInputRef = React.useRef<HTMLInputElement | null>(null);

    function closeButtonClickHander() {
        setIsOpen(false);

        if (request?.status === "Success") {
            window.location.reload();
        }
    }

    async function confirmButtonClickHandler() {
        const surnameInputElement = surnameInputRef.current;
        const nameInputElement = nameInputRef.current;
        const patronymicInputElement = patronymicInputRef.current;

        if (!(nameInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find nameInputElement");
        }

        if (!(surnameInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find surnameInputElement");
        }

        if (!(patronymicInputElement instanceof HTMLInputElement)) {
            throw new TypeError("Failed to find patronymicInputElement");
        }

        const inputedName = nameInputElement.value;
        const inputedSurname = surnameInputElement.value;
        const inputedPatronymic = patronymicInputElement.value;

        if (!inputedName || !inputedSurname) {
            setRequest({ message: "Фамилия и имя являются обязательными.", status: "Error" });
            return;
        }

        setRequest({
            message: null,
            status: "Pending",
        });

        try {
            await TalkNetAPI.patch("/user/change/fullname", {
                surname: inputedSurname,
                name: inputedName,
                patronymic: inputedPatronymic !== "" ? inputedPatronymic : null,
            });

            setRequest({
                status: "Success",
                message: "Данные успешно изменены",
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

    const classes = ["TNUI-ChangeUserFullnameModal TNUI-SettingsPage-modal", className ?? ""].join(" ");

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
                            className="TNUI-ChangeUserFullnameModal-alert"
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
                                className="TNUI-ChangeUserFullnameModal-input"
                                placeholder="Фамилия"
                                defaultValue={user.surname}
                                required
                                ref={surnameInputRef}
                            />
                            <TextInput
                                className="TNUI-ChangeUserFullnameModal-input"
                                placeholder="Имя"
                                defaultValue={user.name}
                                required
                                ref={nameInputRef}
                            />
                            <TextInput
                                className="TNUI-ChangeUserFullnameModal-input"
                                placeholder="Отчество"
                                defaultValue={user.patronymic ?? ""}
                                ref={patronymicInputRef}
                            />
                        </>
                    )}
                </CustomModal>
            )}
        </>
    );
}
