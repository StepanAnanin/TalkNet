import "./AlertModal.scss";
import React from "react";

import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

import ModalWrapper from "../ModalWrapper";

// TODO maybe hide closeIcon????
export default function AlertModal(props: Omit<ModalWindowsProps.AlertModal, "hideCloseButton">) {
    const { className, children, ...otherProps } = props;

    const classes = ["TNUI-AlertModal", className ?? ""].join(" ");

    return (
        <ModalWrapper className={classes} {...otherProps} hideCloseButton>
            {children}
        </ModalWrapper>
    );
}
