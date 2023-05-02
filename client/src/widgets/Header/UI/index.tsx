import "./Header.scss";
import React from "react";

import Button from "../../../shared/UI/Button";
import Logo from "../../../shared/UI/Logo";

import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../../shared/model/hooks/useTypedSelector";
import { AvatarMenu } from "../../../features/AvatarMenu";

// NOTE:
//  Tag <header/> in DOM is instances of HTMLElement class.
//  (You can check it by hovering over this element and reading it's type)
interface HeaderProps extends UiComponentProps<HTMLElement> {
    hideSignInButton?: boolean;
}

export default function Header(props: HeaderProps) {
    const { className, hideSignInButton = false, ...otherProps } = props;
    const { payload: user } = useTypedSelector((state) => state.auth);

    // ================================== picking styles ==================================

    const classes = ["TNUI-Header", className ?? ""].join(" ");

    return (
        <header className={classes} {...otherProps}>
            <div className="TNUI-Header-left">
                <Logo link />
            </div>
            <div className="TNUI-Header-right">
                {!hideSignInButton &&
                    (user ? (
                        <AvatarMenu user={user} />
                    ) : (
                        <Link to="/signin">
                            <Button className="TNUI-Header-signin-button" variant="contained">
                                ВХОД
                            </Button>
                        </Link>
                    ))}
            </div>
        </header>
    );
}
