import "./ChatFragmentDateDivider.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import FormatedDate from "../../../../shared/lib/FormatedDate";

interface MessageBlockDateDividerProps extends UiComponentProps<HTMLDivElement> {
    date: number;
}

export default function ChatFragmentDateDivider(props: MessageBlockDateDividerProps) {
    const { className = "", date, ...otherProps } = props;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatedDate = new FormatedDate(date);
    const isDateYesterday = FormatedDate.isYesterday(Date.now(), date);
    const isDateToday = FormatedDate.isToday(Date.now(), date);

    const classes = ["TNUI-ChatFragmentDateDivider", className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <span className="TNUI-ChatFragmentDateDivider-date">
                {isDateToday ? "Сегодня" : isDateYesterday ? "Вчера" : formatedDate.getDate()}
                {/* 
                    Construction with ternary operators above equal to this:

                    if (isDateToday) {
                        return 'Сегодня';
                    }

                    if (isDateYesterday) {
                        return 'Вчера'
                    }

                    return formatedDate.getDate()
                */}
            </span>
        </div>
    );
}
