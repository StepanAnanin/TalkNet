import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

interface CustomModalProps extends UiComponentProps<HTMLDivElement> {
    model: ModalWindowsProps.CustomModal;
}

export default function CustomModal(props: CustomModalProps) {
    const { className, children, ...otherProps } = props;

    const classes = ["TNUI-CustomModal", className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {children}
        </div>
    );
}
