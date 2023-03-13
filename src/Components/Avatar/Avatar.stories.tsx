import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Avatar } from "./Avatar";

export default {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    id: { control: { type: "string" } },
    width: { control: { type: "range", min: 10, max: 140, step: 2 } },
    height: { control: { type: "range", min: 10, max: 182, step: 2 } },
  },
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: "200",
};
