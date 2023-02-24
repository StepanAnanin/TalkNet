import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DoubledLoader } from "../shared/UI/Loader";

export default {
    title: "DoubledLoader",
    component: DoubledLoader,
    argTypes: {
        size: {
            defaultValue: "medium",
        },
        spinnerColour: {
            defaultValue: "primary",
        },
    },
} as ComponentMeta<typeof DoubledLoader>;

const Template: ComponentStory<typeof DoubledLoader> = (args) => <DoubledLoader {...args} />;

export const View = Template.bind({});
