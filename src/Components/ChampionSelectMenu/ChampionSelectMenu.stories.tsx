import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ChampionSelectMenu } from "./ChampionSelectMenu";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";

export default {
  title: "Components/ChampionSelectMenu",
  component: ChampionSelectMenu,
  argTypes: {
    selectedValue: { type: "string" },
    onSelect: { onClick: { action: "selected" } },
  },
} as ComponentMeta<typeof ChampionSelectMenu>;

const Template: ComponentStory<typeof ChampionSelectMenu> = (args) => (
  <ThemeWrapper>
    <ChampionSelectMenu {...args} />
  </ThemeWrapper>
);

export const Default = Template.bind({});
Default.args = {};
