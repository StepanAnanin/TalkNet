import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Menu from "../shared/UI/Menu";
import MenuItem from "../shared/UI/MenuItem";

export default {
    title: "Menu",
    component: Menu,
    argTypes: {
        colourScheme: {
            defaultValue: "white",
        },
    },
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = (args) => (
    <Menu {...args}>
        <MenuItem>Test</MenuItem>
        <MenuItem>Тест</MenuItem>
        <MenuItem>123</MenuItem>
    </Menu>
);

export const View = Template.bind({});
