import "./CriticalErrorAlert.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import React from "react";
import Alert from "../../../../shared/UI/Alert";

interface CriticalErrorAlertProps extends UiComponentProps<HTMLDivElement> {
    message?: string;
}

// Maybee
export default function CriticalErrorAlert(props: CriticalErrorAlertProps) {
    const { className = "", message = "Произошла неуточнённая критическая ошибка", ...otherProps } = props;

    const classes = ["TNUI-CriticalErrorAlert", className].join(" ");

    function goBackButtonClickHandler() {
        window.history.back();
    }

    return (
        <Alert severity="Error" className={classes} hideIcon {...otherProps}>
            <div className="TNUI-CriticalErrorAlert-wrapper">
                <div className="TNUI-CriticalErrorAlert-img">
                    <ReportProblemIcon />
                </div>
                <div className="TNUI-CriticalErrorAlert-body">
                    <div className="TNUI-CriticalErrorAlert-header">Произошла критическая ошибка</div>
                    <div className="TNUI-CriticalErrorAlert-message TNUI-Custom-Scrollbar">{message}</div>
                    <button className="TNUI-CriticalErrorAlert-go-back-button" onClick={goBackButtonClickHandler}>
                        Назад
                    </button>
                </div>
            </div>
        </Alert>
    );
}
