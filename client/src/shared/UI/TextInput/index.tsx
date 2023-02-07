import "./TextInput.scss";
import React from "react";

import type { VariableUiComponentProps } from "../../types/UI/UiComponentProps";
import type TextInputType from "../../types/UI/TextInputType";

interface TextInputProps extends VariableUiComponentProps<HTMLInputElement> {
    theme?: "dark" | "light";
    placeholder?: string;
    inputClassName?: string;
    placeholderClassName?: string;
    type?: TextInputType;
    style?: React.CSSProperties;
}

// TODO implement theme changing (TSX done, only CSS remain)
export default function TextInput(props: TextInputProps) {
    const {
        children,
        className,
        inputClassName,
        placeholderClassName,
        theme = "dark",
        size = "medium",
        variant = "outlined",
        placeholder,
        ...otherProps
    } = props;

    // ================================== picking styles ==================================

    const inputClasses = [
        "TNUI-TextInput",
        "TNUI-TextInput-" + size,
        "TNUI-TextInput-" + variant,
        inputClassName ?? "",
    ].join(" ");

    const wrapperClasses = [
        "TNUI-InputWrapper",
        "TNUI-InputWrapper-" + theme,
        "TNUI-InputWrapper-" + size,
        "TNUI-InputWrapper-" + variant,
        className ?? "",
    ].join(" ");

    const placeholderClasses = ["TNUI-InputWrapper-placeholder", placeholderClassName ?? ""].join(" ");

    // ===================================== handlers =====================================

    function inputWrapperClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const inputElement = e.currentTarget.querySelector("input");

        if (!(inputElement instanceof HTMLInputElement)) {
            console.warn(`InputWrapper: For correct work prop children must be input element (HTMLInputElement).`);
            return;
        }

        inputElement.focus();
    }

    return (
        <div className={wrapperClasses} onClick={inputWrapperClickHandler}>
            {placeholder && <span className={placeholderClasses}>{placeholder}</span>}
            <input className={inputClasses} {...otherProps} required />
        </div>
    );
}
