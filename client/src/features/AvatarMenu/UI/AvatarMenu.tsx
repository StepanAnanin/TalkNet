import "./AvatarMenu.scss";
import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import type User from "../../../shared/types/entities/User";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import React from "react";
import Avatar from "../../../shared/UI/Avatar";
import Menu from "../../../shared/UI/Menu";
import MenuItem from "../../../shared/UI/MenuItem";
import { useTypedDispatch } from "../../../shared/model/hooks/useTypedDispatch";
import { addLogout } from "../../../entities/User";
import { Link } from "react-router-dom";

interface AvatarMenuProps extends UiComponentProps<HTMLUListElement> {
    user: User;
    avatarClassName?: string;
    avatarId?: string;
    src?: string;
}

/**
 * Currently can appear only below avatar
 */

// TODO replace some properties of User
export default function AvatarMenu(props: AvatarMenuProps) {
    const { user, className = "", avatarClassName, avatarId, src, ...otherProps } = props;

    const dispatch = useTypedDispatch();
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLUListElement | null>(null);

    React.useEffect(() => {
        const menuElement = menuRef.current;

        if (!(menuElement instanceof HTMLElement)) {
            return;
        }

        // Setting Menu coords

        const parentElement = menuElement.parentElement!;
        const menuPos = menuElement.getBoundingClientRect();
        const parentPos = parentElement.getBoundingClientRect();

        menuElement.style.top = parentPos.height + "px";
        menuElement.style.marginLeft = `-${menuPos.width - parentPos.width - 5}px`;
    }, [isOpen]);

    function avatarClickHandler() {
        setIsOpen((p) => !p);
    }

    async function logoutButtonClickHandler() {
        await dispatch(addLogout());
        window.location.reload();
    }

    const classes = ["TNUI-AvatarMenu", className].join(" ");
    const avatarClasses = ["TNUI-AvatarMenu-avatar", avatarClassName].join(" ");

    return (
        <>
            <Avatar src={src} className={avatarClasses} id={avatarId} onClick={avatarClickHandler} />
            {isOpen && (
                // Idk wtf is wrong here for typescript
                <Menu ref={menuRef as any} className={classes} {...otherProps}>
                    <MenuItem className="TNUI-AvatarMenu-item">
                        <Avatar src={src} className="TNUI-AvatarMenu-item_avatar" />
                        <span className="TNUI-AvatarMenu-item_label">{user.userName} Ананьин</span>
                    </MenuItem>
                    {/* 
                            Theme changing button. Not implemented

                    <MenuItem className="TNUI-AvatarMenu-item">
                        <DarkModeRoundedIcon className="TNUI-AvatarMenu-item_img" />
                        <span className="TNUI-AvatarMenu-item_label">
                            Тема:&nbsp;<span className="primary-text">Тёмная</span>
                        </span>
                    </MenuItem> 
                    */}
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
                </Menu>
            )}
        </>
    );
}
