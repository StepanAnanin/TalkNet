import React from "react";
import "./Button.scss";

import type { VariableUiComponentProps } from "../../types/UI/UiComponentProps";

interface ButtonProps extends VariableUiComponentProps<HTMLButtonElement> {
    //
}

export default function Button(props: ButtonProps) {
    const { children, className, size = "medium", variant = "default", ...otherProps } = props;

    // ================================== picking styles ==================================

    // On declaration style must match with size prop default value
    let buttonSizeClass = "TNUI-Button-medium";

    // On declaration style must match with variant prop default value
    let buttonVariantClass = "TNUI-Button-default";

    if (size !== "medium") {
        buttonSizeClass = size === "small" ? "TNUI-Button-small" : "TNUI-Button-large";
    }

    if (variant !== "default") {
        buttonVariantClass = variant === "outlined" ? "TNUI-Button-outlined" : "TNUI-Button-contained";
    }

    const classes = ["TNUI-Button", buttonSizeClass, buttonVariantClass, className ?? ""].join(" ");

    return (
        <button className={classes} {...otherProps} type="button">
            {children}
        </button>
    );
}
