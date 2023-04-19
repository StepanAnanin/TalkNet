import type UiComponentProperties from "./UiComponentProperties";

/**
 * Default props (like listeners, attributes, etc) which have all HTML elemets of type `T`.
 *
 * Represent UI component which isn't interactive and hasn't size options
 *
 * @Examples page, form, section, etc.
 */
export type UiComponentProps<T extends HTMLElement> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, "ref">;

/**
 * Represent UI component which has size options but ins't variable
 *
 * @Examples header (for text), logo (without link), etc.
 */
export interface ScalabelUiComponentProps<T extends HTMLElement> extends UiComponentProps<T> {
    size?: UiComponentProperties.size;
}

/**
 * Represent UI component which is variable and have size options;
 *
 * @Examples button, input, link, etc.
 */
export interface VariableUiComponentProps<T extends HTMLElement> extends ScalabelUiComponentProps<T> {
    variant?: UiComponentProperties.variant;
}
