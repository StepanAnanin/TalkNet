import React from "react";

import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

import ModalWrapper from "../ModalWrapper";

export default function CustomModal(props: ModalWindowsProps.CustomModal) {
    const { className, children, ...otherProps } = props;

    const classes = ["TNUI-CustomModal", className ?? ""].join(" ");

    return (
        <ModalWrapper className={classes} {...otherProps}>
            {children}
        </ModalWrapper>
    );
}
