import React from 'react';
import { Button, Popover, Slider, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useAppModel } from '../../Model';

const { Title, Paragraph } = Typography;

export const SettingsButton = () => {
  const { state, dispatch } = useAppModel();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Popover
        title="Settings"
        open={open}
        placement="bottomRight"
        onOpenChange={setOpen}
        trigger={['click']}
        content={
          <>
            <Title level={5}>Turn limit</Title>
            <Paragraph type="secondary">Set the maximum number of turns to simulate.</Paragraph>
            <Slider min={50} max={500} step={5} defaultValue={state.turnLimit} onAfterChange={dispatch.setTurnLimit} />
          </>
        }
      >
        <Button shape="circle" icon={<SettingOutlined />} type="text" />
      </Popover>
    </>
  );
};
