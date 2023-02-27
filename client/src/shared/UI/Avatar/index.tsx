import React from "react";
import "./Avatar.scss";

import type { ScalabelUiComponentProps } from "../../types/UI/UiComponentProps";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

interface AvatarProps extends ScalabelUiComponentProps<HTMLDivElement> {
    src?: string;
    alt?: string | React.ReactNode;
    outlined?: boolean;
}

// TODO replace alt on failed getting img to default user img (take it from MUI icons)
export default React.forwardRef(function Avatar(props: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) {
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
        <div ref={ref} className={classes} {...otherProps}>
            {src && (
                <img
                    className="TNUI-Avatar-img"
                    src={src}
                    alt=""
                    ref={imgRef}
                    onError={imgLoadErrorHandler}
                    onLoad={imgLoaderHandler}
                />
            )}
            <div className="TNUI-Avatar-alt">
                <PersonRoundedIcon className="TNUI-Avatar-alt_img" />
            </div>
        </div>
    );
});
