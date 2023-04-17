import "./ConfirmModal.scss";
import React from "react";

import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

import ModalWrapper from "../ModalWrapper";

export default function ConfirmModal(props: ModalWindowsProps.ConfirmModal) {
    const { className, children, ...otherProps } = props;

    const classes = ["TNUI-ConfirmModal", className ?? ""].join(" ");

    return (
        <ModalWrapper className={classes} {...otherProps}>
            {children}
        </ModalWrapper>
    );
}
