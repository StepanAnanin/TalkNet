import "./Friend.scss";
import React from "react";

import DeleteIcon from "@mui/icons-material/PersonRemove";

import type { UiComponentProps } from "../../shared/types/UI/UiComponentProps";

import Avatar from "../../shared/UI/Avatar";
import Preview from "../../shared/UI/Preview";
import BaseUserData from "../../shared/types/common/BaseUserData";
import { ConfirmModal } from "../../features/Modal";
import deleteFriend from "../../features/Friends/model/deleteFriend";

interface FriendProps extends UiComponentProps<HTMLDivElement> {
    friend: BaseUserData;
}

export default function Friend({ friend, ...otherProps }: FriendProps) {
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);

    function onDeleteButtonClickHandler() {
        setIsDeleteConfirmModalOpen((p) => !p);
    }

    async function onDeleteConfirm() {
        const deleteResult = await deleteFriend(friend.id);

        if (!deleteResult.ok) {
            alert(deleteResult.message);
            return;
        }

        setIsDeleteConfirmModalOpen(false);
    }

    return (
        <>
            {isDeleteConfirmModalOpen && (
                <ConfirmModal
                    header="Подтвердите действие"
                    onConfirm={onDeleteConfirm}
                    setIsOpen={setIsDeleteConfirmModalOpen}
                    hideCloseIcon
                >
                    Вы уверены что хотите удалить пользователя "{friend.name} {friend.surname}" из списка друзей?
                </ConfirmModal>
            )}
            <Preview img={<Avatar userID={friend.id} className="TNUI-Friend_avatar" />} {...otherProps}>
                <div className="TNUI-Friend">
                    <span className="TNUI-Friend_name" title={`${friend.surname} ${friend.name}`}>
                        {friend.name} {friend.surname}
                    </span>
                    <DeleteIcon className="TNUI-Friend_button" onClick={onDeleteButtonClickHandler} />
                </div>
            </Preview>
        </>
    );
}
