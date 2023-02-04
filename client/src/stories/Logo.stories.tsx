import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Logo from "../shared/UI/Logo";

export default {
    title: "Logo",
    component: Logo,
    argTypes: {
        size: {
            defaultValue: "small",
        },
    },
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const View = Template.bind({});

View.args = {
    size: "small",
};
