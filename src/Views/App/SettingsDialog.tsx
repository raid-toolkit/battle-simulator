import React from 'react';
import { Button, Checkbox, InputNumber, Modal, Slider, Typography } from 'antd';
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
      footer={
        <Button type="primary" onClick={closeDialog}>
          OK
        </Button>
      }
    >
      <Title level={5}>Turn limit</Title>
      <Paragraph>Set the maximum number of boss turns to simulate.</Paragraph>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }}>
        <Slider
          style={{ flex: 1 }}
          min={3}
          max={100}
          step={3}
          value={state.groupLimit}
          onChange={dispatch.setGroupLimit}
        />
        <InputNumber value={state.groupLimit} min={3} max={100} step={3} onChange={dispatch.setGroupLimit} />
      </div>
      <Paragraph>Set the maximum number of turns considered infinite.</Paragraph>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }}>
        <Slider
          style={{ flex: 1 }}
          min={25}
          max={100}
          step={1}
          value={state.turnLimit}
          onChange={dispatch.setTurnLimit}
        />
        <InputNumber min={25} max={100} step={1} value={state.turnLimit} onChange={dispatch.setTurnLimit} />
      </div>
      <Paragraph>Show effect summaries</Paragraph>
      <Checkbox checked={state.effectSummarySettings?.ally} onChange={dispatch.toggleAllyEffectSummary}>
        Ally
      </Checkbox>
      <Checkbox checked={state.effectSummarySettings?.enemy} onChange={dispatch.toggleEnemyEffectSummary}>
        Enemy
      </Checkbox>
    </Modal>
  );
};
