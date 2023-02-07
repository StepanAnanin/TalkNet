import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AuthForm } from "../features/AuthForm";

export default {
    title: "AuthForm",
    component: AuthForm,
} as ComponentMeta<typeof AuthForm>;

const Template: ComponentStory<typeof AuthForm> = (args) => <AuthForm {...args} />;

export const View = Template.bind({});
