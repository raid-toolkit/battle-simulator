import React from 'react';
import { ChampionSetupListView } from './ChampionSetupListView';
import { Button, Card, InputNumber, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { TourStep, TuneState, useAppModel } from '../Model';
import { CopyLink } from '../Components';
import { pack, unpack } from 'jsonpack';

export interface TeamViewProps {}

export interface SelectedTeam {
  key: string;
  name: string;
  isNew?: boolean;
  dirty?: boolean;
}

export const TeamView: React.FC<TeamViewProps> = () => {
  const { state, dispatch } = useAppModel();

  const addChampion = React.useCallback(() => {
    dispatch.addChampionDraft();
    dispatch.completeTourStep(TourStep.AddChampion);
  }, [dispatch]);

  return (
    <Card style={{ height: '100%' }} bodyStyle={{ height: '100%', padding: '8px 0 0 0' }} type="inner">
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Space style={{ padding: '0 8px' }}>
          <InputNumber
            addonBefore="Speed Aura %"
            defaultValue={0}
            value={state.tuneState.speedAura}
            onChange={dispatch.setSpeedAura}
            style={{ width: 165, textAlign: 'right' }}
          />
          <Space.Compact>
            <Button
              id="addChampionButton"
              title="Add Champion"
              disabled={state.tuneState.championList.length >= 5}
              icon={<UserAddOutlined />}
              onClick={addChampion}
            />
          </Space.Compact>
        </Space>
        <ChampionSetupListView />
      </div>
    </Card>
  );
};
