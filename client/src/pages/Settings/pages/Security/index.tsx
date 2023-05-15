import React from "react";

import PasswordIcon from "@mui/icons-material/KeyRounded";
import EmailIcon from "@mui/icons-material/AlternateEmailRounded";
import AccountActivationStateIcon from "@mui/icons-material/ManageAccountsRounded";

import Page from "../../../../shared/UI/Page";
import SettingsSection from "../../UI/SettingsSection";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import FormatedDate from "../../../../shared/lib/FormatedDate";
import ChangeEmailModal from "./UI/ChangeEmailModal";
import ChangePasswordModal from "./UI/ChangePasswordModal";

export default function SecuritySettingsPage() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Require authorization.");
    }

    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = React.useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = React.useState(false);

    const formatedLastPasswordChangeDate = new FormatedDate(user.lastPasswordChange);

    function changeEmailButtonClickHander() {
        setIsChangeEmailModalOpen(true);
    }

    function changePasswordButtonClickHander() {
        setIsChangePasswordModalOpen(true);
    }

    return (
        <Page title="TalkNet | Настройки безопасности" className="TNUI-SettingsPage">
            <SettingsSection header="Активация аккаунта" img={<AccountActivationStateIcon />}>
                Текущее состояние аккаунта:{" "}
                <b style={{ color: user.isActivated ? "yellowgreen" : "crimson" }}>
                    {user.isActivated ? "Активирован" : "Не активирован"}
                </b>
            </SettingsSection>
            <SettingsSection
                header="E-Mail"
                img={<EmailIcon />}
                actionButtonLabel="Сменить E-Mail"
                onActionButtonClick={changeEmailButtonClickHander}
                actionDisabled={!user.isActivated}
                title={!user.isActivated ? "Для выполнения этой операции необходимо активировать аккаунт" : undefined}
            >
                Текущий адрес электронной почты: <b>{user.email}</b>
            </SettingsSection>
            <SettingsSection
                header="Пароль"
                img={<PasswordIcon />}
                actionButtonLabel="Сменить пароль"
                onActionButtonClick={changePasswordButtonClickHander}
            >
                Дата последнего изменения пароля:&nbsp;
                <b>
                    {formatedLastPasswordChangeDate.getDate()} {formatedLastPasswordChangeDate.getTime()}
                </b>
            </SettingsSection>
            {/* ========================== Modals ========================== */}
            <ChangeEmailModal openState={[isChangeEmailModalOpen, setIsChangeEmailModalOpen]} />
            <ChangePasswordModal openState={[isChangePasswordModalOpen, setIsChangePasswordModalOpen]} />
        </Page>
    );
}
