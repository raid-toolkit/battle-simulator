import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SkillEditor } from "./SkillEditor";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";

export default {
  title: "Components/SkillEditor",
  component: SkillEditor,
  argTypes: {
    skillId: { type: "number" },
  },
} as ComponentMeta<typeof SkillEditor>;

const Template: ComponentStory<typeof SkillEditor> = (args) => (
  <ThemeWrapper>
    <SkillEditor {...args} />
  </ThemeWrapper>
);

export const Default = Template.bind({});
Default.args = {
  skillId: 20601,
};
