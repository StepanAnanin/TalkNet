import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "../shared/UI/Button";

export default {
    title: "Button",
    component: Button,
    argTypes: {
        variant: {
            defaultValue: "outlined",
        },
        size: {
            defaultValue: "medium",
        },
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const View = Template.bind({});

View.args = {
    variant: "contained",
    size: "medium",
    children: "Button",
};
