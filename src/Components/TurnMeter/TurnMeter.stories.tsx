import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TurnMeter } from './TurnMeter';

export default {
  title: 'Components/TurnMeter',
  component: TurnMeter,
  argTypes: {
    winner: { control: { type: 'boolean' } },
    showLabel: { control: { type: 'boolean' } },
    value: { control: { type: 'range', min: 0, max: 2, step: 0.00001 } },
    width: { control: { type: 'number', min: 50, max: 500, step: 5 } },
    height: { control: { type: 'number', min: 10, max: 60, step: 5 } },
  },
} as ComponentMeta<typeof TurnMeter>;

const Template: ComponentStory<typeof TurnMeter> = (args) => <TurnMeter {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  value: 0.66,
};

export const SimpleDecimal = Template.bind({});
SimpleDecimal.args = {
  value: 0.6666667,
};

export const ShowLabel = Template.bind({});
ShowLabel.args = {
  value: 0.3,
  height: 32,
  showLabel: true,
};

export const Winner = Template.bind({});
Winner.args = {
  value: 0.66,
  winner: true,
};

export const OverFilled = Template.bind({});
OverFilled.args = {
  value: 1.15,
};

export const OverFilledWinner = Template.bind({});
OverFilledWinner.args = {
  value: 1.15,
  winner: true,
};

export const Details = Template.bind({});
Details.args = {
  value: 0.75,
  children: <div>Details</div>,
};
