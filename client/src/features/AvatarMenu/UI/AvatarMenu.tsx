import "./AvatarMenu.scss";
import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import type User from "../../../shared/types/entities/User";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import React from "react";
import Avatar from "../../../shared/UI/Avatar";
import Menu from "../../../shared/UI/Menu";
import MenuItem from "../../../shared/UI/MenuItem";
import { useTypedDispatch } from "../../../shared/model/hooks/useTypedDispatch";
import { addLogout } from "../../../entities/User";
import { Link } from "react-router-dom";
import ClickAwayListener from "../../../shared/UI/ClickAwayListener";

interface AvatarMenuProps extends UiComponentProps<HTMLUListElement> {
    user: User;
    avatarClassName?: string;
    avatarId?: string;
    src?: string;
}

/**
 * Currently can appear only below avatar
 */

// TODO remove settings link
// TODO replace some properties of User
// TODO add theme changing button here
export default function AvatarMenu(props: AvatarMenuProps) {
    const { user, className = "", avatarClassName, avatarId, src, ...otherProps } = props;

    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLUListElement | null>(null);
    const dispatch = useTypedDispatch();

    React.useEffect(() => {
        const menuElement = menuRef.current;

        if (!(menuElement instanceof HTMLElement)) {
            return;
        }

        // Setting Menu coords

        const parentElement = menuElement.parentElement!;
        const menuPos = menuElement.getBoundingClientRect();
        const parentPos = parentElement.getBoundingClientRect();

        menuElement.style.top = parentPos.bottom + "px";
        menuElement.style.marginLeft = `-${menuPos.width - parentPos.width - 1}px`;
    }, [isOpen]);

    function avatarClickHandler() {
        setIsOpen((p) => !p);
    }

    async function logoutButtonClickHandler() {
        await dispatch(addLogout());
        window.location.reload();
    }

    function clickAwayHandler(e: MouseEvent) {
        // Without stopping propagation menu will not close on clicking avatar due calling avatarClickHandler.
        e.stopPropagation();
        setIsOpen(false);
    }

    const classes = ["TNUI-AvatarMenu", className].join(" ");
    const avatarClasses = ["TNUI-AvatarMenu-avatar", avatarClassName].join(" ");

    return (
        <>
            <div className={`TNUI-AvatarMenu-avatar-wrapper ${isOpen ? "open" : ""}`} onClick={avatarClickHandler}>
                <Avatar src={src} className={avatarClasses} id={avatarId} />
                <span className="TNUI-AvatarMenu-open-indicator">{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
            </div>
            {isOpen && (
                // Idk wtf is wrong here with ref for typescript without as any
                <Menu ref={menuRef as any} className={classes} {...otherProps}>
                    <ClickAwayListener className="TNUI-AvatarMenu-wrapper" onClickAway={clickAwayHandler}>
                        <MenuItem className="TNUI-AvatarMenu-item">
                            <Avatar src={src} className="TNUI-AvatarMenu-item_avatar" />
                            <span className="TNUI-AvatarMenu-item_label">{`${user.name} ${user.surname}`}</span>
                        </MenuItem>
                        <Link className="clear-link" to="/settings">
                            <MenuItem className="TNUI-AvatarMenu-item">
                                <SettingsRoundedIcon className="TNUI-AvatarMenu-item_img" />
                                <span className="TNUI-AvatarMenu-item_label">Настройки</span>
                            </MenuItem>
                        </Link>
                        <MenuItem className="TNUI-AvatarMenu-item" onClick={logoutButtonClickHandler}>
                            <LogoutRoundedIcon className="TNUI-AvatarMenu-item_img dark-primary-text" />
                            <span className="TNUI-AvatarMenu-item_label">Выход</span>
                        </MenuItem>
                    </ClickAwayListener>
                </Menu>
            )}
        </>
    );
}
