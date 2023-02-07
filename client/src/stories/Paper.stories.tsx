import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Paper from "../shared/UI/Paper";

export default {
    title: "Paper",
    component: Paper,
    argTypes: {
        colourShift: {
            defaultValue: 0,
        },
    },
} as ComponentMeta<typeof Paper>;

const Template: ComponentStory<typeof Paper> = (args) => <Paper {...args} />;

export const View = Template.bind({});

View.args = {
    style: { width: "200px", height: "200px" },
    theme: "dark",
    variant: "default",
    borderRadiusScale: 1,
    colourShift: 0,
};
