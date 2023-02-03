import React from "react";
import "./InputWrapper.scss";

import type { Property } from "../../../../node_modules/csstype";
import type { VariableUiComponentProps } from "../../types/UiComponentProps";

type defaultInputWrapperProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface InputWrapperProps extends VariableUiComponentProps, defaultInputWrapperProps {
    theme?: "dark" | "light";
    placeholderClassName?: string;
    placeholder?: string;
    placeholderBackgroundColour?: Property.BackgroundColor;
    placeholderColour?: Property.Color;
}

// TODO implement theme changing (TSX done, only CSS remain)
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

    // ================================= picking a styles =================================

    // On declaration style must match with variant prop default value
    let wrapperVariantStyle = "TNUI-InputWrapper-outlined";

    // On declaration style must match with size prop default value
    let wrapperSizeStyle = "TNUI-InputWrapper-medium";

    const themeClass = theme === "dark" ? "TNUI-InputWrapper-darkTheme" : "TNUI-InputWrapper-lightTheme";

    if (size !== "medium") {
        wrapperSizeStyle = size === "small" ? "TNUI-InputWrapper-small" : "TNUI-InputWrapper-large";
    }

    if (variant !== "outlined") {
        wrapperVariantStyle = variant === "default" ? "TNUI-InputWrapper-default" : "TNUI-InputWrapper-contained";
    }

    const wrapperClasses = ["TNUI-InputWrapper", themeClass, wrapperSizeStyle, wrapperVariantStyle, className ?? ""].join(
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
