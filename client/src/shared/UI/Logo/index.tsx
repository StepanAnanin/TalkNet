import React from "react";
import "./Logo.scss";

import type { ScalabelUiComponentProps } from "../../types/UI/UiComponentProps";

interface LogoProps extends ScalabelUiComponentProps<HTMLSpanElement> {
    //
}

export default function Logo(props: LogoProps) {
    const { className, size = "small", ...otherProps } = props;

    // ================================== picking styles ==================================

    let logoSizeClass = "TNUI-Logo-small";

    if (size !== "small") {
        logoSizeClass = size === "medium" ? "TNUI-Logo-medium" : "TNUI-Logo-large";
    }

    const classes = ["TNUI-Logo", logoSizeClass, className ?? ""].join(" ");

    return (
        <span className={classes} {...otherProps}>
            <img className="TNUI-Logo-img" src="/favicon.ico" alt="a" />
            <span className="TNUI-Logo-label">TalkNet</span>
        </span>
    );
}
