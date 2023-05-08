import React from "react";
import "./Avatar.scss";

import type { ScalabelUiComponentProps } from "../../types/UI/UiComponentProps";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TalkNetApiURL from "../../lib/URL/TalkNetApiURL";

interface AvatarProps extends ScalabelUiComponentProps<HTMLDivElement> {
    src?: string;
    alt?: string | React.ReactNode;
    outlined?: boolean;

    /**
     * If this props is passed then instead of using "src" props to get image
     * will be displayed avatar of user with this specific id or placeholder (if user hasn't avatar or failed to get it).
     */
    userID?: string;
}

// TODO replace alt on failed getting img to default user img (take it from MUI icons)
export default React.forwardRef(function Avatar(props: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { className, src, alt, size = "small", outlined = false, userID, ...otherProps } = props;
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
            {(src || userID) && (
                <img
                    className="TNUI-Avatar-img"
                    src={userID ? `${TalkNetApiURL}/static/user/${userID}/avatar.png` : src}
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
