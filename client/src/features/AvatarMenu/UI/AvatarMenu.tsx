import "./AvatarMenu.scss";
import type { UiComponentProps } from "../../../shared/types/UI/UiComponentProps";
import type User from "../../../shared/types/entities/User";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import React from "react";
import Avatar from "../../../shared/UI/Avatar";
import Menu from "../../../shared/UI/Menu";
import MenuItem from "../../../shared/UI/MenuItem";
import { useTypedDispatch } from "../../../shared/model/hooks/useTypedDispatch";
import { addLogout } from "../../../entities/User";
import ClickAwayListener from "../../../shared/UI/ClickAwayListener";
import { ConfirmModal } from "../../Modal";
import { Navigate } from "react-router-dom";

interface AvatarMenuProps extends UiComponentProps<HTMLUListElement> {
    user: User;
    avatarClassName?: string;
    avatarId?: string;
    src?: string;
}

/**
 * Currently can appear only below avatar
 */

// TODO add theme changing button here
// TODO there are 1 excess render on modal close due to confirm modal handler "onReject" not implemented
export default function AvatarMenu(props: AvatarMenuProps) {
    const { user, className = "", avatarClassName, avatarId, src, ...otherProps } = props;

    const [isOpen, setIsOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
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
        setIsOpen(false);
        setIsConfirmModalOpen(true);
    }

    function clickAwayHandler(e: MouseEvent) {
        // Without stopping propagation menu will not close on clicking avatar due calling avatarClickHandler.
        e.stopPropagation();
        setIsOpen(false);
    }

    function confirmModalRejectHandler() {
        setIsConfirmModalOpen(false);
    }

    async function confirmModalConfirmHandler() {
        await dispatch(addLogout());

        return <Navigate to="/signin" />;
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
                // Idk wtf is wrong here with ref for typescript without "as any"
                <Menu ref={menuRef as any} className={classes} {...otherProps}>
                    <ClickAwayListener className="TNUI-AvatarMenu-wrapper" onClickAway={clickAwayHandler}>
                        <MenuItem className="TNUI-AvatarMenu-item">
                            <Avatar src={src} className="TNUI-AvatarMenu-item_avatar" />
                            <span className="TNUI-AvatarMenu-item_label">{`${user.name} ${user.surname}`}</span>
                        </MenuItem>
                        <MenuItem className="TNUI-AvatarMenu-item" onClick={logoutButtonClickHandler}>
                            <LogoutRoundedIcon className="TNUI-AvatarMenu-item_img dark-primary-text" />
                            <span className="TNUI-AvatarMenu-item_label">Выход</span>
                        </MenuItem>
                    </ClickAwayListener>
                </Menu>
            )}
            {/* ======================== Modal ======================== */}
            {isConfirmModalOpen && (
                <ConfirmModal
                    header="Подтвердите действие"
                    setIsOpen={setIsConfirmModalOpen}
                    onReject={confirmModalRejectHandler}
                    onConfirm={confirmModalConfirmHandler}
                    hideCloseIcon
                >
                    Вы уверены что хотите выйти из аккаунта?
                </ConfirmModal>
            )}
        </>
    );
}
