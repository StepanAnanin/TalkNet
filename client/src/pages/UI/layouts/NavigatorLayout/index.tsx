import "./NavigatorLayout.scss";
import React from "react";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import Header from "../../../../widgets/Header";
import Navigator from "../../../../widgets/Navigator";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import { laptopLayout } from "../../../../shared/lib/helpers/WindowLayoutBreakPoints";

interface NavigatorLayoutProps extends UiComponentProps<HTMLDivElement> {
    /** Works only when NavigatorLayout minified */
    closed?: boolean;
}

export default function NavigatorLayout(props: NavigatorLayoutProps) {
    const { className = "", closed = false, children, ...otherProps } = props;

    const currentWindowLayout = useTypedSelector((state) => state.windowLayout);

    const [isMinified, setIsMinified] = React.useState(currentWindowLayout.breakpoint <= laptopLayout.breakpoint);
    const prevWindowLayout = React.useRef<typeof currentWindowLayout["name"]>(currentWindowLayout.name);

    // Now has problem. On updating state render occure twice, but there are no UI bugs.
    React.useEffect(() => {
        if (currentWindowLayout.name === prevWindowLayout.current) {
            return;
        }

        prevWindowLayout.current = currentWindowLayout.name;

        console.log(`Layout Changed: ${currentWindowLayout.name}`);

        setIsMinified(currentWindowLayout.breakpoint <= laptopLayout.breakpoint);
    }, [currentWindowLayout]);

    const minifiedClasses = `TNUI-NavigatorLayout-minified ${
        closed ? "TNUI-NavigatorLayout-minified-closed" : "TNUI-NavigatorLayout-minified-open"
    }`;

    const classes = ["TNUI-NavigatorLayout", isMinified ? minifiedClasses : "", className].join(" ");

    return (
        <div className={classes} {...otherProps}>
            <Header />
            <div className="TNUI-NavigatorLayout-body">
                <Navigator className="TNUI-NavigatorLayout-navigator" />
                <div className="TNUI-NavigatorLayout-content">{children}</div>
            </div>
        </div>
    );
}
