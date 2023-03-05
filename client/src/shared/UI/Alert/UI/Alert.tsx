import "../styles/Alert.scss";
import React from "react";
import { UiComponentProps } from "../../../types/UI/UiComponentProps";
import AlertHeader from "./AlertHeader";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

interface AlertProps extends UiComponentProps<HTMLDivElement> {
    header?: string;
    titleClassName?: string;
    hideIcon?: boolean;
    severity: "Error" | "Warning" | "Info" | "Success";
}

// TODO add lane on left side of alert
export default function Alert(props: AlertProps) {
    const { className, severity, header, hideIcon = false, children, ...otherProps } = props;

    const classes = ["TNUI-Alert", "TNUI-Alert-" + severity, className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {!hideIcon && (
                <div className="TNUI-Alert-icon">
                    {severity === "Error" && <ErrorOutlineOutlinedIcon />}
                    {severity === "Warning" && <WarningAmberOutlinedIcon />}
                    {severity === "Info" && <InfoOutlinedIcon />}
                    {severity === "Success" && <CheckCircleOutlineOutlinedIcon />}
                </div>
            )}
            <div className="TNUI-Alert-body">
                {header && <AlertHeader severity={severity}>{header}</AlertHeader>}
                <p className="TNUI-Alert-message">{children}</p>
            </div>
        </div>
    );
}
