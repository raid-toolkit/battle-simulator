import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TurnMeter } from "./TurnMeter";

export default {
  title: "Components/TurnMeter",
  component: TurnMeter,
} as ComponentMeta<typeof TurnMeter>;

const Template: ComponentStory<typeof TurnMeter> = (args) => (
  <div>
    <p tabIndex={0}>above</p>
    <TurnMeter {...args} />
    <p tabIndex={0}>below</p>
  </div>
);

export const Simple = Template.bind({});
Simple.args = {
  value: 0.66,
};

export const SimpleDecimal = Template.bind({});
SimpleDecimal.args = {
  value: 0.6666667,
};

export const OverFilled = Template.bind({});
OverFilled.args = {
  value: 1.15,
};

export const Details = Template.bind({});
Details.args = {
  value: 0.75,
  children: <div>Details</div>,
};
