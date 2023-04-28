import "../Loader.scss";
import "./SquareLoader.scss";

import type LoaderProps from "../../types/LoaderProps";

export default function SquareLoader(props: LoaderProps) {
    const { className = "", size = "medium", spinnerColour = "primary", ...otherProps } = props;

    const classes = [
        "TNUI-Loader",
        "TNUI-Loader-spinner-colour_" + spinnerColour,
        "TNUI-SquareLoader",
        "TNUI-SquareLoader-" + size,
        className,
    ].join(" ");

    return <div className={classes} {...otherProps} />;
}
