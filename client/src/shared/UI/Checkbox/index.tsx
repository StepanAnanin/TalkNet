import "./Checkbox.scss";
import type { UiComponentProps } from "../../types/UI/UiComponentProps";
import type UiComponentProperties from "../../types/UI/UiComponentProperties";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import React from "react";

interface CheckboxProps extends Omit<UiComponentProps<HTMLDivElement>, "children"> {
    checkboxClassName?: string;
    checkboxId?: string;
    label?: string | React.ReactNode;
    theme?: UiComponentProperties.theme;
}

/**
 * If you want to click on `label` to trigger `Checkbox` toggling you need to specify this component `checkboxId`.
 */
export default function Checkbox(props: CheckboxProps) {
    const { className, checkboxClassName, checkboxId, label, theme = "dark", defaultChecked = false, ...otherProps } = props;

    const [isChecked, setIsChecked] = React.useState(defaultChecked);

    function checkboxChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setIsChecked(e.currentTarget.checked);
    }

    const checkboxClasses = ["TNUI-Checkbox", checkboxClassName ?? ""].join(" ");
    const wrapperClasses = [
        "TNUI-Checkbox-wrapper",
        theme === "dark" ? "TNUI-Checkbox-wrapper-dark" : "TNUI-Checkbox-wrapper-light",
        className ?? "",
    ].join(" ");

    return (
        <div className={wrapperClasses} {...otherProps}>
            {isChecked ? <CheckRoundedIcon className={checkboxClasses} /> : <div className={checkboxClasses} />}
            <input
                id={checkboxId}
                className="TNUI-Checkbox-origin"
                type="checkbox"
                defaultChecked={defaultChecked}
                onChange={checkboxChangeHandler}
            />
            {label && (
                <label className="TNUI-Checkbox-label" htmlFor={checkboxId}>
                    {label}
                </label>
            )}
        </div>
    );
}
