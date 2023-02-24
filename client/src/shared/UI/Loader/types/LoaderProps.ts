import type { ScalabelUiComponentProps } from "../../../types/UI/UiComponentProps";

export default interface LoaderProps extends ScalabelUiComponentProps<HTMLDivElement> {
    spinnerColour?: "primary" | "dark-primary" | "light-primary" | "lightest-primary";
}
