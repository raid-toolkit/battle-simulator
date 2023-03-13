import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RichString } from "./RichString";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";
import { Card } from "antd";

export default {
  title: "Components/RichString",
  component: RichString,
  argTypes: {
    children: { type: "string" },
  },
} as ComponentMeta<typeof RichString>;

const Template: ComponentStory<typeof RichString> = (args) => (
  <ThemeWrapper>
    <Card>
      <RichString {...args} />
    </Card>
  </ThemeWrapper>
);

export const Default = Template.bind({});
Default.args = {
  children: `Attacks 1 enemy. Has a 15% chance of placing a <color=#1ee600>[Freeze]</color> debuff for 1 turn.`,
};
