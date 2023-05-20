import "./Preview.scss";

import { UiComponentProps } from "../../types/UI/UiComponentProps";

import { Link } from "react-router-dom";

interface PreviewProps extends UiComponentProps<HTMLElement> {
    href?: string;
    img?: React.ReactNode;
}

export default function Preview(props: PreviewProps) {
    const { className = "", href, img, children, ...otherProps } = props;

    const classes = ["TNUI-Preview", className ?? ""].join(" ");

    function PreviewRoot({ children }: { children: React.ReactNode }) {
        if (href) {
            return (
                <Link to={href ?? window.location.pathname + window.location.search} className={classes} {...otherProps}>
                    {children}
                </Link>
            );
        }

        return (
            <div className={classes} {...otherProps}>
                {children}
            </div>
        );
    }

    return (
        <PreviewRoot>
            {img && <div className="TNUI-Preview-img">{img}</div>}
            <div className="TNUI-Preview-body">{children}</div>
        </PreviewRoot>
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
