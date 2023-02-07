import { themes } from "@storybook/theming";

export const parameters = {
    darkMode: {
        current: "dark",
        // Override the default dark theme
        dark: { ...themes.dark, appBg: "black" },
        // Override the default light theme
        light: { ...themes.normal, appBg: "red" },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
