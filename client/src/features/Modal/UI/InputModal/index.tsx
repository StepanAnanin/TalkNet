import "./InputModal.scss";
import React from "react";

import type ModalWindowsProps from "../../../../shared/types/features/ModalWindowsProps";

import ModalWrapper from "../ModalWrapper";
import TextInput from "../../../../shared/UI/TextInput";

// TODO add confirm on enter press
export default React.forwardRef(function InputModal(
    props: ModalWindowsProps.InputModal,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    const { className, inputPlaceholder, children, ...otherProps } = props;

    const classes = ["TNUI-InputModal", className ?? ""].join(" ");

    return (
        <ModalWrapper className={classes} {...otherProps}>
            <p className="TNUI-InputModal_decription">{children}</p>
            <TextInput className="TNUI-InputModal_input" placeholder={inputPlaceholder} ref={ref} />
        </ModalWrapper>
    );
});
