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
      <Paragraph>Set the maximum number of boss turns to simulate.</Paragraph>
      <Slider
        style={{ marginTop: 50 }}
        tooltip={{ open: true }}
        min={1}
        max={20}
        step={1}
        value={state.bossTurnLimit}
        onAfterChange={dispatch.setBossTurnLimit}
      />
      <Paragraph>Set the maximum number of turns considered infinite.</Paragraph>
      <Slider
        style={{ marginTop: 50 }}
        tooltip={{ open: true }}
        min={10}
        max={100}
        step={1}
        value={state.turnLimit}
        onAfterChange={dispatch.setTurnLimit}
      />
    </Modal>
  );
};
