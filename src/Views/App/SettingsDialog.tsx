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
      <Paragraph type="secondary">Set the maximum number of turns to simulate.</Paragraph>
      <Slider min={50} max={500} step={5} defaultValue={state.turnLimit} onAfterChange={dispatch.setTurnLimit} />
    </Modal>
  );
};
