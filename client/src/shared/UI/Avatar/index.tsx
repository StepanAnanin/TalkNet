import React from "react";
import "./Avatar.scss";

import type { ScalabelUiComponentProps } from "../../types/UI/UiComponentProps";

interface AvatarProps extends ScalabelUiComponentProps<HTMLDivElement> {
    src?: string;
    alt?: string;
    outlined?: boolean;
}

export default function Avatar(props: AvatarProps) {
    const { className, src, alt, size = "small", outlined = false, ...otherProps } = props;
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    // ================================== picking styles ==================================

    const outlineClass = outlined ? "TNUI-Avatar-outlined" : "";

    const classes = ["TNUI-Avatar", "TNUI-Avatar-" + size, outlineClass, className ?? ""].join(" ");

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
        <div className={classes} {...otherProps}>
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
