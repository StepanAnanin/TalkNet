import "./Preview.scss";

import { UiComponentProps } from "../../types/UI/UiComponentProps";

import { Link } from "react-router-dom";

interface PreviewProps extends UiComponentProps<HTMLElement> {
    href?: string;
    img?: React.ReactNode;
}

export default function Preview(props: PreviewProps) {
    const { className = "", img, children, ...otherProps } = props;

    const classes = ["TNUI-Preview", className ?? ""].join(" ");

    return (
        <PreviewRoot className={classes} {...otherProps}>
            {img && <div className="TNUI-Preview-img">{img}</div>}
            <div className="TNUI-Preview-body">{children}</div>
        </PreviewRoot>
    );
}

function PreviewRoot({ href, className = "", children, ...otherProps }: PreviewProps) {
    if (href) {
        return (
            <Link
                to={href ?? window.location.pathname + window.location.search}
                className={className + "TNUI-Preview__link"}
                {...otherProps}
            >
                {children}
            </Link>
        );
    }

    return (
        <div className={className} {...otherProps}>
            {children}
        </div>
    );
}

// ========================================= Skeleton =========================================

interface PreviewSkeletonProps {
    hideBottom?: boolean;
}

export function PreviewSkeleton({ hideBottom = false }: PreviewSkeletonProps) {
    return (
        <div className="TNUI-PreviewSkeleton">
            <div className="TNUI-PreviewSkeleton-img" />
            <div className="TNUI-PreviewSkeleton-body">
                <div className="TNUI-PreviewSkeleton-top" />
                {!hideBottom && <div className="TNUI-PreviewSkeleton-bottom" />}
            </div>
        </div>
    );
}
