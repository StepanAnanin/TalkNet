import React from "react";
import "./Button.scss";

import type { VariableUiComponentProps } from "../../types/UiComponentProps";

type defaultButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

interface ButtonProps extends defaultButtonProps, VariableUiComponentProps {
    //
}

export default function Button(props: ButtonProps) {
    const { children, className, size = "medium", variant = "default", ...otherProps } = props;

    // ================================= picking a styles =================================

    // On declaration style must match with size prop default value
    let buttonSizeStyle = "TNUI-Button-medium";

    // On declaration style must match with variant prop default value
    let buttonVariantStyle = "TNUI-Button-default";

    if (size !== "medium") {
        buttonSizeStyle = size === "small" ? "TNUI-Button-small" : "TNUI-Button-large";
    }

    if (variant !== "default") {
        buttonVariantStyle = variant === "outlined" ? "TNUI-Button-outlined" : "TNUI-Button-contained";
    }

    const classes = ["TNUI-Button", buttonSizeStyle, buttonVariantStyle, className ?? ""].join(" ");

    return (
        <button className={classes} {...otherProps}>
            {children}
        </button>
    );
}
