import "./SettingsList.scss";

import UserIcon from "@mui/icons-material/AccountCircleRounded";
import SecurityIcon from "@mui/icons-material/LockRounded";

import NavigatorExplorerItem from "../NavigatorExplorerItem";
import { useLocation } from "react-router-dom";

export default function SettingsList() {
    const location = useLocation();
    const currentSettingsPage = location.pathname.split("/n/settings/")[1];

    return (
        <>
            <NavigatorExplorerItem
                to="/n/settings/user?nt=settings"
                img={<UserIcon className="TNUI-SettingsList-item_img" />}
                className={
                    "TNUI-SettingsList-item" + (currentSettingsPage === "user" ? " TNUI-SettingsList-item__current" : "")
                }
            >
                <span className="TNUI-SettingsList-item_label">Пользователь</span>
            </NavigatorExplorerItem>
            <NavigatorExplorerItem
                to="/n/settings/security?nt=settings"
                img={<SecurityIcon className="TNUI-SettingsList-item_img" />}
                className={
                    "TNUI-SettingsList-item" + (currentSettingsPage === "security" ? " TNUI-SettingsList-item__current" : "")
                }
            >
                <span className="TNUI-SettingsList-item_label">Безопасность</span>
            </NavigatorExplorerItem>
        </>
    );
}
