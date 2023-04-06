import "./MessageBlockDateDivider.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";

interface MessageBlockDateDividerProps extends UiComponentProps<HTMLDivElement> {
    date: number;
}

// BUG Today and yesterday label not work correctly, so currently disable them
export default function MessageBlockDateDivider(props: MessageBlockDateDividerProps) {
    const { className = "", date, ...otherProps } = props;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatedDate = new FormatedDate(date);
    // const isDateYesterday = FormatedDate.isYesterday(Date.now(), date);
    // const isDateToday = new Date().getDay() === new Date(date).getDay();

    const classes = ["TNUI-MessageBlockDateDivider", className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <span className="TNUI-MessageBlockDateDivider-date">
                {/* 
                    if (isDateToday) {
                        return 'Сегодня';
                    }

                    if (isDateYesterday) {
                        return 'Вчера'
                    }

                    return formatedDate.getDate()
                */}
                {/* {isDateToday ? "Сегодня" : isDateYesterday ? "Вчера" : formatedDate.getDate()} */}
                {formatedDate.getDate()}
            </span>
        </div>
    );
}
