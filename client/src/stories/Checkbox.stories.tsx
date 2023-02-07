import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Checkbox from "../shared/UI/Checkbox";

export default {
    title: "Checkbox",
    component: Checkbox,
    argTypes: {
        label: {
            defaultValue: "Example of text",
        },
    },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const View = Template.bind({});

View.args = {
    label: "Example of text",
    id: "",
};
