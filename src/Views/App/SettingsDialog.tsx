import React from 'react';
import { Button, Modal, Slider, Typography } from 'antd';
import { useAppModel } from '../../Model';
const { Title, Paragraph } = Typography;

export const SettingsDialog: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const closeDialog = () => dispatch.setSettingsVisible(false);
  return (
    <Modal
      title="Settings"
      open={state.settingsVisible}
      onCancel={closeDialog}
      footer={[
        <Button type="primary" onClick={closeDialog}>
          OK
        </Button>,
      ]}
    >
      <Title level={5}>Turn limit</Title>
      <Paragraph type="secondary">Set the maximum number of boss turns to simulate.</Paragraph>
      <Slider min={1} max={20} step={1} defaultValue={state.bossTurnLimit} onAfterChange={dispatch.setBossTurnLimit} />
      <Paragraph type="secondary">Set the maximum number of turns considered infinite.</Paragraph>
      <Slider min={10} max={100} step={1} defaultValue={state.turnLimit} onAfterChange={dispatch.setTurnLimit} />
    </Modal>
  );
};
