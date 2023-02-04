import React from "react";
import "./Page.scss";

import type { UiComponentProps } from "../../types/UiComponentProps";

interface PageComponentProps extends UiComponentProps<HTMLDivElement> {
    title?: string;
}

// This HOC mostly need for document title update.
// Without this component need to duplicate code at lines 12-14 and pass an addition props on each page.
export default function Page({ title, className, children, ...otherProps }: PageComponentProps) {
    if (title) {
        document.title = title;
    }

    const classes = ["TNUI-Page", className ?? ""].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {children}
        </div>
    );
}
