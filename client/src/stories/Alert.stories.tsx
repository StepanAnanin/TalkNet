import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Alert from "../shared/UI/Alert";

export default {
    title: "Alert",
    component: Alert,
    argTypes: {
        hideIcon: {
            defaultValue: false,
        },
    },
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => (
    <Alert {...args}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, deleniti cum! Repellendus fugiat quidem sint, ipsum
        consequuntur laborum, rerum tempore vel modi earum nam recusandae molestiae laudantium aut eveniet quibusdam.
    </Alert>
);

export const View = Template.bind({});
