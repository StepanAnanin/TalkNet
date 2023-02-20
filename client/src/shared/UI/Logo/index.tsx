import "./Logo.scss";

import type { ScalabelUiComponentProps, UiComponentProps } from "../../types/UI/UiComponentProps";

import { Link } from "react-router-dom";

interface LogoProps extends ScalabelUiComponentProps<HTMLDivElement> {
    link?: boolean;
}

export default function Logo(props: LogoProps) {
    const { className, size = "small", link = false, ...otherProps } = props;

    const classes = ["TNUI-Logo-wrapper", "TNUI-Logo-" + size, className ?? ""].join(" ");

    return (
        <LogoWrapper link={link} className={classes}>
            <div className="TNUI-Logo" {...otherProps}>
                <img className="TNUI-Logo-img" src="/favicon.ico" alt="a" />
                <span className="TNUI-Logo-label">TalkNet</span>
            </div>
        </LogoWrapper>
    );
}

// ===============================================================================================

interface LogoWrapperProps extends UiComponentProps<HTMLElement> {
    link: boolean;
}

function LogoWrapper({ link, children, className }: LogoWrapperProps) {
    return link ? (
        <Link to="/" className={`${className} TNUI-Logo-link`}>
            {children}
        </Link>
    ) : (
        <span className={className}>{children}</span>
    );
}
