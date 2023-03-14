import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { NumberSpinner } from "./NumberSpinner";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";
import { Input, Space, Switch } from "antd";

export default {
  title: "Components/NumberSpinner",
  component: NumberSpinner,
  argTypes: {
    initialValue: { type: "number" },
    value: { type: "number" },
    scalar: { type: "number", defaultValue: 0.01 },
    precision: { type: "number", defaultValue: 1 },
    onChange: { onChange: { action: "changed" } },
  },
} as ComponentMeta<typeof NumberSpinner>;

const Template: ComponentStory<typeof NumberSpinner> = (args) => (
  <ThemeWrapper>
    <NumberSpinner {...args} />
  </ThemeWrapper>
);

const BoundTemplate: ComponentStory<typeof NumberSpinner> = ({
  onChange,
  ...args
}) => {
  const [value, setValue] = React.useState<number | null>();
  const [enabled, setEnabled] = React.useState<boolean>(true);

  const handleChange = React.useCallback(
    (value: number | null) => {
      enabled && setValue(value);
      onChange?.(value);
    },
    [onChange, enabled]
  );

  const setSwitched = React.useCallback((checked: boolean) => {
    setEnabled(checked);
  }, []);

  return (
    <ThemeWrapper>
      <Space>
        <NumberSpinner value={value} onChange={handleChange} {...args} />
        <Switch checked={enabled} onChange={setSwitched} title="Update" />
        <Input value={value || undefined} />
      </Space>
    </ThemeWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const InitialValue = Template.bind({});
InitialValue.args = {
  initialValue: 3,
};

export const Precision = Template.bind({});
Precision.args = {
  initialValue: 3.55,
  precision: 1,
};

export const Controlled = BoundTemplate.bind({});
Controlled.args = {
  initialValue: 2,
};
