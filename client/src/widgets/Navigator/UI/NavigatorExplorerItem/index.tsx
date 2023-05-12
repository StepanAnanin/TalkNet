import "./NavigatorExplorerItem.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";

import { Link } from "react-router-dom";

interface NavigatorExplorerItemProps extends UiComponentProps<HTMLAnchorElement> {
    to: string;
    img: React.ReactNode;
}

export default function NavigatorExplorerItem(props: NavigatorExplorerItemProps) {
    const { className = "", to, img, children, ...otherProps } = props;

    const classes = ["TNUI-NavigatorExplorerItem", className ?? ""].join(" ");

    return (
        <Link to={to} className={classes} {...otherProps}>
            <div className="TNUI-NavigatorExplorerItem-img">{img}</div>
            <div className="TNUI-NavigatorExplorerItem-body">{children}</div>
        </Link>
    );
}

// ========================================= Skeleton =========================================

interface NavigatorExplorerItemSkeletonProps {
    hideBottom?: boolean;
}

export function NavigatorExplorerItemSkeleton({ hideBottom = false }: NavigatorExplorerItemSkeletonProps) {
    return (
        <div className="TNUI-NavigatorExplorerItemSkeleton">
            <div className="TNUI-NavigatorExplorerItemSkeleton-img" />
            <div className="TNUI-NavigatorExplorerItemSkeleton-body">
                <div className="TNUI-NavigatorExplorerItemSkeleton-top" />
                {!hideBottom && <div className="TNUI-NavigatorExplorerItemSkeleton-bottom" />}
            </div>
        </div>
    );
}
