import React from "react";

interface PageComponentProps {
    title?: string;
    className?: string;
    children: React.ReactNode;
}

// This HOC mostly need for document title update.
// Without this component need to duplicate code at lines 12-14 and pass an addition props on each page.
export default function Page({ title, className, children }: PageComponentProps) {
    if (title) {
        document.title = title;
    }

    return <div className={className}>{children}</div>;
}
