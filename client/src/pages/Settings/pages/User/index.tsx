import "./UserSettingsPage.scss";

import AvatarIcon from "@mui/icons-material/AccountBoxRounded";
import FullUserNameIcon from "@mui/icons-material/BadgeRounded";

import Page from "../../../../shared/UI/Page";
import SettingsSection from "../../UI/SettingsSection";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import Avatar from "../../../../shared/UI/Avatar";

export default function UserSettingsPage() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Require authorization.");
    }

    return (
        <Page title="TalkNet | Настройки пользователя" className="TNUI-SettingsPage TNUI-UserSettingsPage">
            <SettingsSection header="Аватар пользователя" img={<AvatarIcon />} actionButtonLabel="Изменить">
                <div className="TNUI-UserSettingsPage-user-avatar-variants">
                    <Avatar size="small" className="TNUI-UserSettingsPage-user-avatar-variants_item" />
                    <Avatar size="medium" className="TNUI-UserSettingsPage-user-avatar-variants_item" />
                    <Avatar size="large" className="TNUI-UserSettingsPage-user-avatar-variants_item" />
                </div>
            </SettingsSection>
            <SettingsSection header="Ф.И.О" img={<FullUserNameIcon />} actionButtonLabel="Изменить">
                Фамилия пользователя: <b>{user.surname}</b>
                <br />
                Имя пользователя: <b>{user.name}</b>
                <br />
                Отчество пользователя: <b>{user.patronymic ?? "Не указано"}</b>
            </SettingsSection>
        </Page>
    );
}
