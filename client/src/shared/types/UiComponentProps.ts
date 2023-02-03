/**
 * Represent UI component which isn't interactive and hasn't size options
 *
 * @Examples page, form, section, etc.
 */

export interface UiComponentProps {
    className?: string;
}

/**
 * Represent UI component which has size options but ins't variable
 *
 * @Examples header (for text), logo (without link), etc.
 */
export interface ScalabelUiComponentProps extends UiComponentProps {
    size?: "small" | "medium" | "large";
}

/**
 * Represent UI component which is variable and have size options;
 *
 * @Examples button, input, link, etc.
 */
export interface VariableUiComponentProps extends ScalabelUiComponentProps {
    variant?: "default" | "contained" | "outlined";
}
