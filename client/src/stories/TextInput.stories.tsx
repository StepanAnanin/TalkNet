import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextInput from "../shared/UI/TextInput";

export default {
    title: "TextInput",
    component: TextInput,
    argTypes: {
        size: {
            defaultValue: "medium",
        },
    },
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const View = Template.bind({});

View.args = {
    size: "medium",
    placeholder: "Password",
};
