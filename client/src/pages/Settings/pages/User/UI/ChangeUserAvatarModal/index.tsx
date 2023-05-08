import "./ChangeUserAvatarModal.scss";
import React from "react";

import type ChangeRequest from "../../../../../../shared/types/pages/settings/ChangeRequest";
import type { UiComponentProps } from "../../../../../../shared/types/UI/UiComponentProps";
import type User from "../../../../../../shared/types/entities/User";

import { CustomModal } from "../../../../../../features/Modal";
import { AxiosError } from "axios";
import TalkNetAPI from "../../../../../../shared/api/TalkNetAPI";
import Alert from "../../../../../../shared/UI/Alert";
import Avatar from "../../../../../../shared/UI/Avatar";
import FileSelectForm from "../../../../../../features/FileSelectForm";

interface ChangeUserAvatarModalProps extends UiComponentProps<HTMLDivElement> {
    user: User;
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const newAvatarPreviewElementClass = "TNUI-ChangeUserAvatarModal-new-avatar-preview";
let newAvatarURL: string = "#"; // Must allways be non-empty string

// TODO need to decompose all settings page modals requests
export default function ChangeUserAvatarModal(props: ChangeUserAvatarModalProps) {
    const { className = "", user, openState, ...otherProps } = props;

    const [selectedAvatar, setSelectedAvatar] = React.useState<File | null>(null);
    const [request, setRequest] = React.useState<ChangeRequest | null>(null);
    const [isOpen, setIsOpen] = openState;

    React.useEffect(() => {
        if (!selectedAvatar) {
            return;
        }

        const avatarPreviewElements = Array.from(document.querySelectorAll(`.${newAvatarPreviewElementClass} img`));

        for (const avatarPreviewElement of avatarPreviewElements) {
            if (!(avatarPreviewElement instanceof HTMLImageElement)) {
                throw new TypeError("avatarPreviewElement has incorrect value");
            }

            newAvatarURL = URL.createObjectURL(selectedAvatar);
            avatarPreviewElement.src = newAvatarURL;
        }

        setRequest(null);
    }, [selectedAvatar]);

    // Clear newAvatarURL on unmount, not doing this may cause memory leak.
    React.useEffect(() => {
        return function () {
            URL.revokeObjectURL(newAvatarURL);
            newAvatarURL = "#";
        };
    }, []);

    function closeButtonClickHander() {
        setIsOpen(false);

        if (request?.status === "Success") {
            window.location.reload();
        }
    }

    async function confirmButtonClickHandler() {
        if (!selectedAvatar) {
            return;
        }

        setRequest({
            message: null,
            status: "Pending",
        });

        try {
            const formData = new FormData();

            formData.append("selected-avatar", selectedAvatar);

            await TalkNetAPI.patch("/user/change/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });

            setRequest({
                status: "Success",
                message: "Аватар успешно изменён. Необходимо перезагрузить страницу чтобы изменения отобразились.",
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

    function onInvalidFileTypeSelect(file: File) {
        setRequest({
            status: "Error",
            message: `Файл "${file.name}" имеет недопустимый формат. Аватар должен быть изображением в формате png или jpg (jpeg).`,
        });
    }

    const classes = ["TNUI-ChangeUserAvatarModal TNUI-SettingsPage-modal", className ?? ""].join(" ");
    const newAvatarPreviewClasses = [
        // If there are no selected avatar
        !selectedAvatar ? "TNUI-ChangeUserAvatarModal-avatar-preview__hidden" : "",
        "TNUI-ChangeUserAvatarModal-avatar-preview",
        newAvatarPreviewElementClass,
    ].join(" ");

    return (
        <>
            {isOpen && (
                <CustomModal
                    className={classes}
                    header="Смена аватара"
                    setIsOpen={setIsOpen}
                    onClose={closeButtonClickHander}
                    onConfirm={confirmButtonClickHandler}
                    hideCloseIcon
                    hideConfirmButton={request?.status === "Success"}
                    isConfirmButtonDisabled={!selectedAvatar}
                    dontCloseOnClickAway
                    {...otherProps}
                >
                    {request && request.status !== "Pending" && (
                        <Alert
                            className="TNUI-ChangeUserAvatarModal-alert"
                            severity={request.status}
                            header={request.status === "Error" ? "Ошибка" : "Успех"}
                            hideIcon
                        >
                            {request.message}
                        </Alert>
                    )}
                    {request?.status !== "Success" && (
                        <>
                            <FileSelectForm
                                className="TNUI-ChangeUserAvatarModal-new-avatar-select-form"
                                name="ChangeUserAvatarModal-new-avatar-select-form"
                                onInvalidFileType={onInvalidFileTypeSelect}
                                selectedFileState={[selectedAvatar, setSelectedAvatar]}
                                allowedFileTypes={["image/jpeg", "image/png"]}
                            />
                            <div className="TNUI-ChangeUserAvatarModal-avatars-block">
                                {/* =============================== Current avatar =============================== */}
                                <div className="TNUI-ChangeUserAvatarModal-avatar-preview">
                                    <span className="TNUI-ChangeUserAvatarModal-avatar-preview_header">Текущий аватар</span>
                                    <div className="TNUI-ChangeUserAvatarModal-avatar-preview-list">
                                        <Avatar
                                            size="small"
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                            userID={user.id}
                                        />
                                        <Avatar
                                            size="medium"
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                            userID={user.id}
                                        />
                                        <Avatar
                                            size="large"
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                            userID={user.id}
                                        />
                                    </div>
                                </div>
                                {/* =============================== New avatar =============================== */}
                                <div className={newAvatarPreviewClasses}>
                                    <span className="TNUI-ChangeUserAvatarModal-avatar-preview_header">Новый аватар</span>
                                    <div className="TNUI-ChangeUserAvatarModal-avatar-preview-list">
                                        <Avatar
                                            size="small"
                                            src={newAvatarURL}
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                        />
                                        <Avatar
                                            size="medium"
                                            src={newAvatarURL}
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                        />
                                        <Avatar
                                            size="large"
                                            src={newAvatarURL}
                                            className="TNUI-ChangeUserAvatarModal-avatar-preview-list_item"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CustomModal>
            )}
        </>
    );
}
