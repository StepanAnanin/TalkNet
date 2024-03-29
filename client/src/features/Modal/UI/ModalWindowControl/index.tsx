import "./ModalWindowControl.scss";
import React from "react";

import { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import Button from "../../../../shared/UI/Button";

interface ModalControlProps extends UiComponentProps<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    confirmButtonLabel?: string;
    closeButtonLabel?: string;
    hideCloseButton?: boolean;
    hideConfirmButton?: boolean;
    onConfirm?: () => void;
    onClose?: () => void;
    onReject?: () => void;
    isConfirmButtonDisabled?: boolean;
}

export default function ModalControl(props: ModalControlProps) {
    const {
        className = "",
        setIsOpen,
        confirmButtonLabel,
        closeButtonLabel,
        onReject,
        onClose,
        onConfirm,
        hideCloseButton,
        hideConfirmButton,
        isConfirmButtonDisabled = false,
        ...otherProps
    } = props;

    function closeButtonClickHandler() {
        setIsOpen((p) => !p);
        onReject && onReject();
        onClose && onClose();
    }

    function confirmButtonClickHandler() {
        onConfirm && onConfirm();
    }

    const classes = ["TNUI-ModalControl", className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {!hideCloseButton && (
                <Button variant="outlined" className="TNUI-ModalControl_close-button" onClick={closeButtonClickHandler}>
                    {closeButtonLabel ?? "Закрыть"}
                </Button>
            )}
            {!hideConfirmButton && (
                <Button
                    variant="contained"
                    className="TNUI-ModalControl_confirm-button"
                    onClick={confirmButtonClickHandler}
                    disabled={isConfirmButtonDisabled}
                >
                    {confirmButtonLabel ?? "Подтвердить"}
                </Button>
            )}
        </div>
    );
}
