import React from "react";
import "./TextInput.scss";
import InputWrapper from "../InputWrapper";

import type { VariableUiComponentProps } from "../../types/UiComponentProps";

interface TextInputProps extends VariableUiComponentProps<HTMLInputElement> {
    theme?: "dark" | "light";
    placeholder?: string;
    inputClassName?: string;
    placeholderClassName?: string;
    type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
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

    // On declaration style must match with size prop default value
    let inputSizeClass = "TNUI-TextInput-medium";

    // On declaration style must match with variant prop default value
    let inputVariantClass = "TNUI-TextInput-outlined";

    const themeClass = theme === "dark" ? "TNUI-TextInput-darkTheme" : "TNUI-TextInput-lightTheme";

    if (size !== "medium") {
        inputSizeClass = size === "small" ? "TNUI-TextInput-small" : "TNUI-TextInput-large";
    }

    if (variant !== "outlined") {
        inputVariantClass = variant === "default" ? "TNUI-TextInput-default" : "TNUI-TextInput-contained";
    }

    const inputClasses = ["TNUI-TextInput", themeClass, inputSizeClass, inputVariantClass, inputClassName ?? ""].join(" ");

    return (
        <InputWrapper
            className={className}
            theme={theme}
            size={size}
            variant={variant}
            placeholder={placeholder}
            placeholderClassName={placeholderClassName}
        >
            <input className={inputClasses} {...otherProps} required />
        </InputWrapper>
    );
}
