import "./Paper.scss";
import type UiComponentProperties from "../../types/UI/UiComponentProperties";
import type { VariableUiComponentProps } from "../../types/UI/UiComponentProps";

interface PaperProps extends Omit<VariableUiComponentProps<HTMLDivElement>, "size"> {
    theme?: UiComponentProperties.theme;
    colourShift?: 0 | 1 | 2;
    borderRadiusScale?: 1 | 2 | 3;
}

export default function Paper(props: PaperProps) {
    const {
        className,
        theme = "dark",
        colourShift = 0,
        variant = "default",
        borderRadiusScale = 1,
        children,
        ...otherProps
    } = props;

    const classes = [
        "TNUI-Paper-root",
        "TNUI-Paper-colour-shift-" + colourShift,
        "TNUI-Paper-" + variant,
        "TNUI-Paper-" + theme,
        "TNUI-Paper-border-radius-scale-" + borderRadiusScale,
        className ?? "",
    ].join(" ");

    return (
        <div className={classes} {...otherProps}>
            {children}
        </div>
    );
}
