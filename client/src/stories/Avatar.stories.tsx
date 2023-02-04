import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Avatar from "../shared/UI/Avatar";

export default {
    title: "Avatar",
    component: Avatar,
    argTypes: {
        size: {
            defaultValue: "small",
        },
        outlined: {
            defaultValue: false,
        },
        src: {
            defaultValue:
                "https://sun1.userapi.com/sun1-89/s/v1/ig2/TszzdV2lAeA8vm3Nl43G1Bi5Zrj18fuyvsPC3wDXrqgnic0jmUv1uznr956zj0ify9CEjqWlt_IIorEWVHRmhXR0.jpg?size=50x50&quality=96&crop=370,85,380,380&ava=1",
        },
        alt: {
            defaultValue: "img",
        },
    },
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const View = Template.bind({});

View.args = {
    size: "small",
    alt: "img",
    outlined: false,
    src: "https://sun1.userapi.com/sun1-89/s/v1/ig2/TszzdV2lAeA8vm3Nl43G1Bi5Zrj18fuyvsPC3wDXrqgnic0jmUv1uznr956zj0ify9CEjqWlt_IIorEWVHRmhXR0.jpg?size=50x50&quality=96&crop=370,85,380,380&ava=1",
};
