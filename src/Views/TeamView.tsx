import React from 'react';
import { ChampionSetupListView } from './ChampionSetupListView';
import { Badge, Button, Card, InputNumber, Space } from 'antd';
import { ThunderboltOutlined, UserAddOutlined } from '@ant-design/icons';
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

  const getLink = React.useCallback(() => {
    const packed = pack(state.tuneState);
    const link = btoa(packed);
    const url = new URL(document.location.href);
    url.hash = '';
    url.search = `?ts=${link}`;
    return url.toString();
  }, [state.tuneState]);

  React.useEffect(() => {
    try {
      const queryString = new URLSearchParams(document.location.search);
      const savedState = queryString.get('ts');
      if (savedState) {
        const unpacked = unpack<TuneState>(atob(savedState));
        dispatch.importTune(unpacked);
      }
    } catch {}
  }, [dispatch]);

  return (
    <Badge.Ribbon text="Team" placement="start">
      <Card
        style={{ height: '100vh' }}
        bodyStyle={{
          height: '100%',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Space wrap>
            <InputNumber
              addonBefore="Speed Aura"
              prefix="%"
              defaultValue={0}
              value={state.tuneState.speedAura}
              onChange={dispatch.setSpeedAura}
              addonAfter={<ThunderboltOutlined />}
              style={{ width: 200, textAlign: 'right' }}
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
            <CopyLink getLink={getLink} />
          </Space>
          <ChampionSetupListView />
        </div>
      </Card>
    </Badge.Ribbon>
  );
};
