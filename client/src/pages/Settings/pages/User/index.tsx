import "./UserSettingsPage.scss";
import React from "react";

import AvatarIcon from "@mui/icons-material/AccountBoxRounded";
import FullUserNameIcon from "@mui/icons-material/BadgeRounded";

import Page from "../../../../shared/UI/Page";
import SettingsSection from "../../UI/SettingsSection";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import Avatar from "../../../../shared/UI/Avatar";
import ChangeUserFullnameModal from "./UI/ChangeUserFullnameModal";
import ChangeUserAvatarModal from "./UI/ChangeUserAvatarModal";

export default function UserSettingsPage() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Require authorization.");
    }

    const [isChangeUserFullnameModalOpen, setIsChangeUserFullnameModalOpen] = React.useState(false);
    const [isChangeUserAvatarModalOpen, setIsChangeUserAvatarModalOpen] = React.useState(false);

    function changeUserFullnameInput() {
        setIsChangeUserFullnameModalOpen(true);
    }

    function changeUserAvatarInput() {
        setIsChangeUserAvatarModalOpen(true);
    }

    return (
        <Page title="TalkNet | Настройки пользователя" className="TNUI-SettingsPage TNUI-UserSettingsPage">
            <SettingsSection
                header="Аватар пользователя"
                img={<AvatarIcon />}
                actionButtonLabel="Изменить"
                onActionButtonClick={changeUserAvatarInput}
            >
                <div className="TNUI-UserSettingsPage-user-avatar-variants">
                    <Avatar size="small" className="TNUI-UserSettingsPage-user-avatar-variants_item" userID={user.id} />
                    <Avatar size="medium" className="TNUI-UserSettingsPage-user-avatar-variants_item" userID={user.id} />
                    <Avatar size="large" className="TNUI-UserSettingsPage-user-avatar-variants_item" userID={user.id} />
                </div>
            </SettingsSection>
            <SettingsSection
                header="Ф.И.О"
                img={<FullUserNameIcon />}
                actionButtonLabel="Изменить"
                onActionButtonClick={changeUserFullnameInput}
            >
                Фамилия пользователя: <b>{user.surname}</b>
                <br />
                Имя пользователя: <b>{user.name}</b>
                <br />
                Отчество пользователя: <b>{user.patronymic ?? "Не указано"}</b>
            </SettingsSection>
            {/* ========================== Modals ========================== */}
            <ChangeUserFullnameModal
                user={user}
                openState={[isChangeUserFullnameModalOpen, setIsChangeUserFullnameModalOpen]}
            />
            <ChangeUserAvatarModal user={user} openState={[isChangeUserAvatarModalOpen, setIsChangeUserAvatarModalOpen]} />
        </Page>
    );
}
