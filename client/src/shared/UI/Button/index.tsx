import React from "react";
import "./Button.scss";

import type { VariableUiComponentProps } from "../../types/UI/UiComponentProps";

interface ButtonProps extends VariableUiComponentProps<HTMLButtonElement> {
    //
}

export default function Button(props: ButtonProps) {
    const { children, className, size = "medium", variant = "default", ...otherProps } = props;

    const classes = ["TNUI-Button", "TNUI-Button-" + size, "TNUI-Button-" + variant, className ?? ""].join(" ");

    return (
        <button className={classes} {...otherProps} type="button">
            {children}
        </button>
    );
}
