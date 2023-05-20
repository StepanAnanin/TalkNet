import "./SettingsList.scss";

import UserIcon from "@mui/icons-material/AccountCircleRounded";
import SecurityIcon from "@mui/icons-material/LockRounded";

import { useLocation } from "react-router-dom";
import Preview from "../../../../shared/UI/Preview";

export default function SettingsList() {
    const location = useLocation();
    const currentSettingsPage = location.pathname.split("/n/settings/")[1];

    return (
        <>
            <Preview
                href="/n/settings/user?nt=settings"
                img={<UserIcon className="TNUI-SettingsList-item_img" />}
                className={
                    "TNUI-SettingsList-item" + (currentSettingsPage === "user" ? " TNUI-SettingsList-item__current" : "")
                }
            >
                <span className="TNUI-SettingsList-item_label">Пользователь</span>
            </Preview>
            <Preview
                href="/n/settings/security?nt=settings"
                img={<SecurityIcon className="TNUI-SettingsList-item_img" />}
                className={
                    "TNUI-SettingsList-item" + (currentSettingsPage === "security" ? " TNUI-SettingsList-item__current" : "")
                }
            >
                <span className="TNUI-SettingsList-item_label">Безопасность</span>
            </Preview>
        </>
    );
}
