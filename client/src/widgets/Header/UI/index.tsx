import React from "react";
import "./Header.scss";
import Avatar from "../../../shared/UI/Avatar";
import Button from "../../../shared/UI/Button";
import Logo from "../../../shared/UI/Logo";

import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";

// NOTE:
//  Tag <header/> in DOM is instances of HTMLElement class.
//  (You can check it by hovering over this element and reading it's type)
interface HeaderProps extends UiComponentProps<HTMLElement> {
    //
}

export default function Header(props: HeaderProps) {
    const { className, ...otherProps } = props;

    // ================================== picking styles ==================================

    const classes = ["TNUI-Header", className ?? ""].join(" ");

    return (
        <header className={classes} {...otherProps}>
            <div className="TNUI-Header-left">
                <Logo />
            </div>
            <div className="TNUI-Header-right">
                <Avatar
                    className="TNUI-Header-user-avatar"
                    src="https://lh3.googleusercontent.com/ogw/AAEL6sgg6jf1uy6ccb1Smq3ysp_FXPZ3p4kReGNFROZ8=s32-c-mo"
                    alt="F"
                />
                {/* <Button className="TNUI-Header-signin-button" variant="contained">
                    Вход
                </Button> */}
            </div>
        </header>
    );
}