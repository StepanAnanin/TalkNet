import React from "react";
import "./Avatar.scss";

import type { ScalabelUiComponentProps } from "../../types/UiComponentProps";

interface AvatarProps extends ScalabelUiComponentProps<HTMLDivElement> {
    src?: string;
    alt?: string;
    outlined?: boolean;
}

export default function Avatar(props: AvatarProps) {
    const { className, src, alt, size = "small", outlined = false } = props;
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    // ================================== picking styles ==================================

    const outlineClass = outlined ? "TNUI-Avatar-outlined" : "";
    let avatarSizeClass = "TNUI-Avatar-small";

    if (size !== "small") {
        avatarSizeClass = size === "medium" ? "TNUI-Avatar-medium" : "TNUI-Avatar-large";
    }

    const classes = ["TNUI-Avatar", avatarSizeClass, outlineClass, className ?? ""].join(" ");

    // ===================================== handlers =====================================

    // This function hides the image if it fails to get it.
    function imgLoadErrorHandler() {
        const imgElement = imgRef.current;

        if (!imgElement) {
            console.warn(`Avatar: imgRef is refer to ${imgElement} instead of img element`);
            return;
        }

        imgElement.style.display = "none";
    }

    // This function need to make img visible if on previous load occur error.
    // (cuz function imgLoadErrorHandler will hide it on error)
    function imgLoaderHandler() {
        const imgElement = imgRef.current;

        if (!imgElement) {
            console.warn(`Avatar: imgRef is refer to ${imgElement} instead of img element`);
            return;
        }

        if (imgElement.style.display === "none") {
            imgElement.style.display = "block";
        }
    }

    return (
        <div className={classes}>
            <img
                className="TNUI-Avatar-img"
                src={src}
                alt=""
                ref={imgRef}
                onError={imgLoadErrorHandler}
                onLoad={imgLoaderHandler}
            />
            <div className="TNUI-Avatar-alt">{alt}</div>
        </div>
    );
}
