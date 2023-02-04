import React from "react";
import "./InputWrapper.scss";

import type { Property } from "../../../../node_modules/csstype";
import type { VariableUiComponentProps } from "../../types/UiComponentProps";

interface InputWrapperProps extends VariableUiComponentProps<HTMLDivElement> {
    theme?: "dark" | "light";
    placeholderClassName?: string;
    placeholder?: string;
    placeholderBackgroundColour?: Property.BackgroundColor;
    placeholderColour?: Property.Color;
}

// TODO implement theme changing (TSX done, only CSS remain)
// TODO remove this component. Cuz it is dependency for other component
export default function InputWrapper(props: InputWrapperProps) {
    const {
        children,
        className,
        theme = "dark",
        size = "medium",
        variant = "outlined",
        placeholder,
        placeholderClassName,
        placeholderColour,
        placeholderBackgroundColour,
        onClick,
        ...otherProps
    } = props;

    // ================================== picking styles ==================================

    // On declaration style must match with variant prop default value
    let wrapperVariantClass = "TNUI-InputWrapper-outlined";

    // On declaration style must match with size prop default value
    let wrapperSizeClass = "TNUI-InputWrapper-medium";

    const themeClass = theme === "dark" ? "TNUI-InputWrapper-darkTheme" : "TNUI-InputWrapper-lightTheme";

    if (size !== "medium") {
        wrapperSizeClass = size === "small" ? "TNUI-InputWrapper-small" : "TNUI-InputWrapper-large";
    }

    if (variant !== "outlined") {
        wrapperVariantClass = variant === "default" ? "TNUI-InputWrapper-default" : "TNUI-InputWrapper-contained";
    }

    const wrapperClasses = ["TNUI-InputWrapper", themeClass, wrapperSizeClass, wrapperVariantClass, className ?? ""].join(
        " "
    );
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
        <div className={wrapperClasses} onClick={inputWrapperClickHandler} {...otherProps}>
            {placeholder && (
                <span
                    className={placeholderClasses}
                    style={{ backgroundColor: placeholderBackgroundColour, color: placeholderColour }}
                >
                    {placeholder}
                </span>
            )}
            {children}
        </div>
    );
}
