import React from 'react';
import { ChampionSetupListView } from './ChampionSetupListView';
import { Button, Card, Space } from 'antd';
import { ClearOutlined, UserAddOutlined } from '@ant-design/icons';
import { AreaId, StatKind, TourStep, isAuraApplicable, useAppModel } from '../Model';
import './TeamView.css';
import { StageSelectionView } from './StageSelectionView';
import { RTK } from '../Data';

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

  const leaderType = state.tuneState.championList[0]?.typeId;
  const leaderSkill = leaderType ? RTK.heroTypes[leaderType]?.leaderSkill : undefined;
  const speedAura =
    isAuraApplicable(leaderSkill, AreaId.dungeon) && leaderSkill?.kind?.toLocaleLowerCase() === StatKind.speed
      ? leaderSkill.value * 100
      : 0;

  return (
    <Card className="team-view-card" type="inner">
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Space style={{ padding: '0 8px' }}>
          <div className="input-box speed-aura-input" style={{ color: speedAura > 0 ? 'var(--cyan)' : undefined }}>
            <img className="avatar speed-aura-icon" src="/images/aura/Speed.png" alt="speed aura" /> {speedAura}%
          </div>
          <StageSelectionView style={{ width: 100 }} />
          <Button
            id="addChampionButton"
            title="Add Champion"
            disabled={state.tuneState.championList.length >= 5}
            icon={<UserAddOutlined />}
            onClick={addChampion}
          />
          <Button
            title="Reset"
            disabled={state.tuneState.championList.length === 0}
            icon={<ClearOutlined />}
            onClick={dispatch.loadDefaultTune}
          >
            Reset
          </Button>
        </Space>
        <ChampionSetupListView />
      </div>
    </Card>
  );
};
