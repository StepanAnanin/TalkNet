import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DefaultLoader } from "../shared/UI/Loader";

export default {
    title: "DefaultLoader",
    component: DefaultLoader,
    argTypes: {
        size: {
            defaultValue: "medium",
        },
        spinnerColour: {
            defaultValue: "primary",
        },
    },
} as ComponentMeta<typeof DefaultLoader>;

const Template: ComponentStory<typeof DefaultLoader> = (args) => <DefaultLoader {...args} />;

export const View = Template.bind({});
