import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CopyLink } from './CopyLink';
import { ThemeWrapper } from '../Storybook/ThemeWrapper';
import { Card } from 'antd';

export default {
  title: 'Components/CopyLink',
  component: CopyLink,
  argTypes: {
    children: { type: 'string' },
  },
} as ComponentMeta<typeof CopyLink>;

const Template: ComponentStory<typeof CopyLink> = (args) => (
  <ThemeWrapper>
    <Card>
      <CopyLink {...args} />
    </Card>
  </ThemeWrapper>
);

export const Default = Template.bind({});
Default.args = {
  link: 'https://www.google.com',
};

export const GetLink = Template.bind({});
Default.args = {
  async getLink() {
    return 'https://www.google.com';
  },
};
