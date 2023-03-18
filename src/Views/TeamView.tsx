import React from 'react';
import { ChampionSetupListView } from './ChampionSetupListView';
import { Badge, Button, Card, ConfigProvider, Divider, Input, Select, Space } from 'antd';
import { FolderOpenOutlined, SaveOutlined, ThunderboltOutlined, UserAddOutlined } from '@ant-design/icons';
import { ChampionSetup, SavedTeam, SavedTeamVersion } from '../Model';
import { removeItemAtIndex, replaceItemAtIndex } from '../Common';
import { teamDataStore } from '../Data/Forage';
import { useForageCollection } from '../Components/Hooks';
import type { DefaultOptionType } from 'antd/es/select';
import MenuItem from 'antd/es/menu/MenuItem';
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
          champions: championList,
        },
      ];
      addOrUpdateTeam(selectedTeam.key, { name: selectedTeam.name, versions }, (savedTeam) => ({
        ...savedTeam,
        versions: savedTeam.versions.concat(versions),
      }));
      setSelectedTeam({ ...selectedTeam, dirty: false, isNew: false });
    }
  }, [addOrUpdateTeam, championList, selectedTeam]);

  const loadTeam = React.useCallback(() => {
    if (!selectedTeam) {
      return;
    }

    const existingTeam = items[selectedTeam.key];
    if (!existingTeam) {
      return;
    }

    onChampionListUpdated(existingTeam.versions[existingTeam.versions.length - 1].champions);
    setSelectedTeam({ ...selectedTeam, dirty: false });
  }, [items, onChampionListUpdated, selectedTeam]);

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
          <div style={{ display: 'flex' }}>
            <Space>
              <Input
                addonBefore="Speed Aura"
                suffix="%"
                defaultValue={0}
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
          </div>
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
