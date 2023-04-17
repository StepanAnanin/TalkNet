import "./ModalWindowHeader.scss";
import React from "react";

import CloseIcon from "@mui/icons-material/CloseRounded";
import { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

interface ModalHeaderProps extends UiComponentProps<HTMLDivElement> {
    label: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hideCloseIcon?: boolean;
}

export default function ModalHeader(props: ModalHeaderProps) {
    const { className = "", label, setIsOpen, hideCloseIcon = false, ...otherProps } = props;

    const classes = ["TNUI-ModalHeader", className ?? ""].join(" ");

    function closeIconClickHandler() {
        setIsOpen(false);
    }

    return (
        <div className={classes} {...otherProps}>
            <span className="TNUI-ModalHeader_label" title={label}>
                {label}
            </span>
            {!hideCloseIcon && <CloseIcon className="TNUI-ModalHeader_close-icon" onClick={closeIconClickHandler} />}
        </div>
    );
}
