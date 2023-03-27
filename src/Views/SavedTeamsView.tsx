import React from 'react';
import { Button, Space } from 'antd';
import { FolderOpenOutlined, SaveOutlined } from '@ant-design/icons';
import { SavedTeam, SavedTeamVersion, useAppModel } from '../Model';
import { teamDataStore } from '../Data/Forage';
import { useForageCollection } from '../Components/Hooks';
import { SelectSavedTeam } from './SelectSavedTeam';
import { v4 } from 'uuid';
import { SelectedTeam } from './TeamView';

export const SavedTeamsView: React.FC = () => {
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
          champions: state.tuneState.championList,
        },
      ];
      addOrUpdateTeam(selectedTeam.key, { name: selectedTeam.name, versions }, (savedTeam) => ({
        ...savedTeam,
        versions: savedTeam.versions.concat(versions),
      }));
      setSelectedTeam({ ...selectedTeam, dirty: false, isNew: false });
    }
  }, [addOrUpdateTeam, selectedTeam, state.tuneState.championList, state.tuneState.speedAura]);

  const loadTeam = React.useCallback(() => {
    if (!selectedTeam) {
      return;
    }

    const existingTeam = items[selectedTeam.key];
    if (!existingTeam) {
      return;
    }

    const lastVersion = existingTeam.versions[existingTeam.versions.length - 1];
    lastVersion.champions.forEach(
      (champion) => (champion.skillOpener = champion.abilities.findIndex((ability) => ability.opener))
    );
    dispatch.temp_setChampionsList(lastVersion.champions);
    dispatch.setSpeedAura(lastVersion.speedAura);
    setSelectedTeam({ ...selectedTeam, dirty: false });
  }, [items, selectedTeam, dispatch]);

  const teams = React.useMemo(() => {
    if (selectedTeam && !items[selectedTeam.key]) {
      let clone = { ...items };
      clone[selectedTeam.key] = { name: `${selectedTeam.name}*`, versions: [] };
      return clone;
    }
    return items;
  }, [items, selectedTeam]);

  return (
    <Space.Compact>
      <Button
        title="Save Team"
        icon={<SaveOutlined />}
        type={selectedTeam?.dirty || selectedTeam?.isNew ? 'primary' : 'default'}
        disabled={!selectedTeam}
        onClick={saveTeam}
      />
      {selectedTeam && !selectedTeam.isNew && (
        <Button title="Load Team" icon={<FolderOpenOutlined />} onClick={loadTeam} />
      )}
      <SelectSavedTeam
        teams={teams}
        selectedTeam={selectedTeam?.key || ''}
        teamSelected={teamSelected}
        teamCreated={teamCreated}
        dirty={selectedTeam?.isNew}
      />
    </Space.Compact>
  );
};
