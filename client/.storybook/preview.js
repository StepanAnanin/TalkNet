import React from "react";
import { themes } from "@storybook/theming";
import { MemoryRouter } from "react-router";
import { configure, addDecorator } from "@storybook/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "../src/app/core/WithStore";

const store = createStore(rootReducer);

addDecorator((Story) => (
    <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
            <Story />
        </MemoryRouter>
    </Provider>
));

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

configure(require.context("../src", true, /\.stories\.js$/), module);
