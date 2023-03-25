import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Blessing } from './Blessing';
import { BlessingTypeId } from '../../Model';

export default {
  title: 'Components/Blessing',
  component: Blessing,
  argTypes: {
    id: { control: { type: 'number' } },
    width: { control: { type: 'range', min: 10, max: 140, step: 2 } },
    height: { control: { type: 'range', min: 10, max: 182, step: 2 } },
  },
} as ComponentMeta<typeof Blessing>;

const Template: ComponentStory<typeof Blessing> = (args) => <Blessing {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: BlessingTypeId.Adaptation,
};
