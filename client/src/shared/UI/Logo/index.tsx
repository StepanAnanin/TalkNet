import React from "react";
import "./Logo.scss";

import type { ScalabelUiComponentProps } from "../../types/UI/UiComponentProps";

interface LogoProps extends ScalabelUiComponentProps<HTMLSpanElement> {
    //
}

export default function Logo(props: LogoProps) {
    const { className, size = "small", ...otherProps } = props;

    const classes = ["TNUI-Logo", "TNUI-Logo-" + size, className ?? ""].join(" ");

    return (
        <span className={classes} {...otherProps}>
            <img className="TNUI-Logo-img" src="/favicon.ico" alt="a" />
            <span className="TNUI-Logo-label">TalkNet</span>
        </span>
    );
}
