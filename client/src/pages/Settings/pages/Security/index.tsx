import PasswordIcon from "@mui/icons-material/KeyRounded";
import EmailIcon from "@mui/icons-material/AlternateEmailRounded";
import AccountActivationStateIcon from "@mui/icons-material/ManageAccountsRounded";

import Page from "../../../../shared/UI/Page";
import SettingsSection from "../../UI/SettingsSection";
import { useTypedSelector } from "../../../../shared/model/hooks/useTypedSelector";
import FormatedDate from "../../../../shared/lib/helpers/FormatedDate";

export default function SecuritySettingsPage() {
    const { payload: user } = useTypedSelector((state) => state.auth);

    if (!user) {
        throw new Error("Require authorization.");
    }

    const formatedLastPasswordChangeDate = new FormatedDate(user.lastPasswordChange);

    return (
        <Page title="TalkNet | Настройки безопасности" className="TNUI-SettingsPage">
            <SettingsSection header="Активация аккаунта" img={<AccountActivationStateIcon />}>
                Текущее состояние аккаунта:{" "}
                <b style={{ color: user.isActivated ? "yellowgreen" : "crimson" }}>
                    {user.isActivated ? "Активирован" : "Не активирован"}
                </b>
            </SettingsSection>
            <SettingsSection header="E-Mail" img={<EmailIcon />} actionButtonLabel="Сменить E-Mail">
                Текущий адрес электронной почты: <b>{user.email}</b>
            </SettingsSection>
            <SettingsSection header="Пароль" img={<PasswordIcon />} actionButtonLabel="Сменить пароль">
                Дата последнего изменения пароля:&nbsp;
                <b>
                    {formatedLastPasswordChangeDate.getDate()} {formatedLastPasswordChangeDate.getTime()}
                </b>
            </SettingsSection>
        </Page>
    );
}
