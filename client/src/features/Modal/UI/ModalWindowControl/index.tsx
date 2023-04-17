import "./ModalWindowControl.scss";
import React from "react";

import { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import Button from "../../../../shared/UI/Button";

interface ModalControlProps extends UiComponentProps<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    confirmButtonLabel?: string;
    closeButtonLabel?: string;
    hideCloseButton?: boolean;
    onConfirm?: () => void;
    onClose?: () => void;
}

export default function ModalControl(props: ModalControlProps) {
    const {
        className = "",
        setIsOpen,
        confirmButtonLabel,
        closeButtonLabel,
        onClose,
        onConfirm,
        hideCloseButton,
        ...otherProps
    } = props;

    function closeButtonClickHandler() {
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
            <Button variant="contained" className="TNUI-ModalControl_confirm-button" onClick={confirmButtonClickHandler}>
                {confirmButtonLabel ?? "Подтвердить"}
            </Button>
        </div>
    );
}