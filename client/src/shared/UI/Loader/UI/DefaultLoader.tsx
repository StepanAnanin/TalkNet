import "../styles/Loader.scss";
import "../styles/DefaultLoader.scss";

import type LoaderProps from "../types/LoaderProps";

export default function DefaultLoader(props: LoaderProps) {
    const { className = "", size = "medium", spinnerColour = "primary", ...otherProps } = props;

    const classes = [
        "TNUI-Loader",
        "TNUI-Loader-spinner-colour_" + spinnerColour,
        "TNUI-DefaultLoader",
        "TNUI-DefaultLoader-" + size,
        className,
    ].join(" ");

    return <div className={classes} {...otherProps} />;
}
