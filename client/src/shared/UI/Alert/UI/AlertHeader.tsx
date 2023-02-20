import "../styles/AlertHeader.scss";
import React from "react";
import { UiComponentProps } from "../../../types/UI/UiComponentProps";

interface AlertHeaderProps extends UiComponentProps<HTMLDivElement> {
    severity: "Error" | "Warning" | "Info" | "Success";
}

export default function AlertHeader(props: AlertHeaderProps) {
    const { className, severity, ...otherProps } = props;

    const classes = ["TNUI-AlertHeader", "TNUI-AlertHeader-" + severity, className ?? ""].join(" ");

    return <div className={classes} {...otherProps}></div>;
}
