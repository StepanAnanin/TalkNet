import "./MenuItem.scss";

import type { UiComponentProps } from "../../types/UI/UiComponentProps";
import type { MenuTextColour } from "../Menu";

interface MenuItemProps extends UiComponentProps<HTMLLIElement> {
    colour?: MenuTextColour;
}

export default function MenuItem(props: MenuItemProps) {
    const { className = "", ...otherProps } = props;

    const classes = ["TNUI-MenuItem", className].join(" ");

    return <li className={classes} {...otherProps}></li>;
}
