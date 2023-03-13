import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";

import { CardDivider } from "./CardDivider";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";
import { Button, Card } from "antd";

export default {
  title: "Components/CardDivider",
  component: CardDivider,
} as ComponentMeta<typeof CardDivider>;

const Template: ComponentStory<typeof CardDivider> = (args) => (
  <ThemeWrapper>
    <Card title="Card Title">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
      Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
      sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a,
      semper congue, euismod non, mi.
      <CardDivider {...args} />
      <Button type="primary">Primary button</Button>
      <Button>Default button</Button>
      <Button type="dashed">Dashed button</Button>
    </Card>
  </ThemeWrapper>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <span>
      Description <QuestionCircleOutlined style={{ marginInlineStart: 4 }} />
    </span>
  ),
};

export const Dashed = Template.bind({});
Dashed.args = {
  dashed: true,
  children: (
    <span>
      Actions <SettingOutlined style={{ marginInlineStart: 4 }} />
    </span>
  ),
};
