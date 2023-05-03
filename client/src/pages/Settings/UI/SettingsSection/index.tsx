import "./SettingsSection.scss";

import type { UiComponentProps } from "../../../../shared/types/UI/UiComponentProps";
import Button from "../../../../shared/UI/Button";

interface SettingsSectionProps extends UiComponentProps<HTMLElement> {
    header: string;
    actionButtonLabel?: string;
    onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    img?: React.ReactNode;
}

export default function SettingsSection(props: SettingsSectionProps) {
    const { className = "", header, img, actionButtonLabel, onActionButtonClick, children, ...otherProps } = props;

    const classes = ["TNUI-SettingsSection", className ?? ""].join(" ");

    return (
        <section className={classes} {...otherProps}>
            <div className="TNUI-SettingsSection-header">
                <div className="TNUI-SettingsSection-header_section-name">
                    {img && <div className="TNUI-SettingsSection-header_section-name-img-wrapper">{img}</div>}
                    <span className="TNUI-SettingsSection-header_section-name-label">{header}</span>
                </div>
                {actionButtonLabel && (
                    <Button
                        variant="contained"
                        size="small"
                        className="TNUI-SettingsSection-header_action-button"
                        onClick={onActionButtonClick}
                    >
                        {actionButtonLabel}
                    </Button>
                )}
            </div>
            <div className="TNUI-SettingsSection-body">{children}</div>
        </section>
    );
}
