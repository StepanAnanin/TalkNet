import "../styles/Loader.scss";
import "../styles/DoubledLoader.scss";

import type LoaderProps from "../types/LoaderProps";

export default function DoubledLoader(props: LoaderProps) {
    const { className = "", size = "medium", spinnerColour = "primary", ...otherProps } = props;

    const classes = [
        "TNUI-Loader",
        "TNUI-Loader-spinner-colour_" + spinnerColour,
        "TNUI-DoubledLoader",
        "TNUI-DoubledLoader-" + size,
        className,
    ].join(" ");

    return <div className={classes} {...otherProps} />;
}
