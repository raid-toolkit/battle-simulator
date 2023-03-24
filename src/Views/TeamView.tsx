import React from 'react';
import { ChampionSetupListView } from './ChampionSetupListView';
import { Badge, Button, Card, Input, InputNumber, Space } from 'antd';
import { FolderOpenOutlined, SaveOutlined, ThunderboltOutlined, UserAddOutlined } from '@ant-design/icons';
import { ChampionSetup, SavedTeam, SavedTeamVersion, useAppModel } from '../Model';
import { removeItemAtIndex, replaceItemAtIndex } from '../Common';
import { teamDataStore } from '../Data/Forage';
import { useForageCollection } from '../Components/Hooks';
import { SelectSavedTeam } from './SelectSavedTeam';
import { v4 } from 'uuid';

export interface TeamViewProps {
  readonly championList: readonly Readonly<ChampionSetup>[];
  onChampionListUpdated: (championList: readonly Readonly<ChampionSetup>[]) => void;
}

export interface SelectedTeam {
  key: string;
  name: string;
  isNew?: boolean;
  dirty?: boolean;
}

export const TeamView: React.FC<TeamViewProps> = ({ championList, onChampionListUpdated }) => {
  const { state, dispatch } = useAppModel();
  const { items, addOrUpdate: addOrUpdateTeam /*, remove*/ } = useForageCollection<SavedTeam>(teamDataStore);

  const [selectedTeam, setSelectedTeam] = React.useState<SelectedTeam>();

  const teamSelected = React.useCallback(
    (key: string) => {
      const existingTeam = items[key];
      setSelectedTeam(existingTeam ? { key, name: existingTeam.name } : undefined);
    },
    [items]
  );

  const teamCreated = React.useCallback((name: string) => {
    setSelectedTeam({ key: v4(), name, dirty: true, isNew: true });
  }, []);

  const saveTeam = React.useCallback(() => {
    if (selectedTeam) {
      const versions: SavedTeamVersion[] = [
        {
          speedAura: state.tuneState.speedAura,
          champions: championList,
        },
      ];
      addOrUpdateTeam(selectedTeam.key, { name: selectedTeam.name, versions }, (savedTeam) => ({
        ...savedTeam,
        versions: savedTeam.versions.concat(versions),
      }));
      setSelectedTeam({ ...selectedTeam, dirty: false, isNew: false });
    }
  }, [addOrUpdateTeam, championList, selectedTeam, state.tuneState.speedAura]);

  const loadTeam = React.useCallback(() => {
    if (!selectedTeam) {
      return;
    }

    const existingTeam = items[selectedTeam.key];
    if (!existingTeam) {
      return;
    }

    const lastVersion = existingTeam.versions[existingTeam.versions.length - 1];
    onChampionListUpdated(lastVersion.champions);
    dispatch.setSpeedAura(lastVersion.speedAura);
    setSelectedTeam({ ...selectedTeam, dirty: false });
  }, [items, onChampionListUpdated, selectedTeam, dispatch]);

  const teams = React.useMemo(() => {
    if (selectedTeam && !items[selectedTeam.key]) {
      let clone = { ...items };
      clone[selectedTeam.key] = { name: `${selectedTeam.name}*`, versions: [] };
      return clone;
    }
    return items;
  }, [items, selectedTeam]);

  const updateChampion = React.useCallback(
    (index: number, value: ChampionSetup) => {
      onChampionListUpdated(replaceItemAtIndex(championList, index, value));
    },
    [championList, onChampionListUpdated]
  );

  const addChampion = React.useCallback(() => {
    onChampionListUpdated([...championList, { abilities: [] }]);
  }, [championList, onChampionListUpdated]);

  const deleteChampion = React.useCallback(
    (index: number) => {
      onChampionListUpdated(removeItemAtIndex(championList, index));
    },
    [championList, onChampionListUpdated]
  );

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
                title="Add Champion"
                disabled={championList.length >= 5}
                icon={<UserAddOutlined />}
                onClick={addChampion}
              />
            </Space.Compact>
            <Space.Compact>
              <Button title="Save Team" icon={<SaveOutlined />} onClick={saveTeam} />
              {!selectedTeam?.isNew && <Button title="Load Team" icon={<FolderOpenOutlined />} onClick={loadTeam} />}
              <SelectSavedTeam
                teams={teams}
                selectedTeam={selectedTeam?.key || ''}
                teamSelected={teamSelected}
                teamCreated={teamCreated}
                dirty={selectedTeam?.dirty}
              />
            </Space.Compact>
          </Space>
          <div></div>
          <ChampionSetupListView
            items={championList}
            editable={true}
            addChampion={addChampion}
            deleteChampion={deleteChampion}
            updateChampion={updateChampion}
          />
        </div>
      </Card>
    </Badge.Ribbon>
  );
};
