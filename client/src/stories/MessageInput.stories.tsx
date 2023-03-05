import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MessageInput from "../features/MessageInput";

export default {
    title: "MessageInput",
    component: MessageInput,
} as ComponentMeta<typeof MessageInput>;

const Template: ComponentStory<typeof MessageInput> = (args) => <MessageInput {...args} />;

export const View = Template.bind({});
