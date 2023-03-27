import React from 'react';
import { Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SavedTeam } from '../Model';

export interface SavedTeamOption {
  key: string;
  label: React.ReactNode;
  name: string;
  value: string;
}

export interface SelectSavedTeamProps {
  teams: Readonly<Record<string, Readonly<SavedTeam>>>;
  selectedTeam: string;
  teamSelected: (key: string) => void;
  teamCreated: (name: string) => void;
  dirty?: boolean;
}

function filterOption(input: string = '', option: SavedTeamOption | undefined) {
  return !!option?.name.toLocaleLowerCase().includes(input.toLocaleLowerCase());
}

const NEW_TEAM_KEY = '~~new';

export const SelectSavedTeam: React.FC<SelectSavedTeamProps> = ({
  teams,
  selectedTeam,
  teamSelected,
  teamCreated,
  dirty,
}) => {
  const [customName, setCustomName] = React.useState<string>();

  const savedTeamOptions = React.useMemo<SavedTeamOption[]>(() => {
    const items = Object.entries(teams).map<SavedTeamOption>(([key, team]) => ({
      key,
      label: team.name,
      name: team.name,
      value: key,
    }));

    const hasMatches = items.some((item) => customName === item.name);
    if (customName && !hasMatches) {
      items.push({
        key: NEW_TEAM_KEY,
        label: (
          <span>
            <PlusOutlined /> Create "{customName}"
          </span>
        ),
        name: customName,
        value: NEW_TEAM_KEY,
      });
    }

    return items;
  }, [teams, customName]);

  const handleSelect = React.useCallback(
    (key: string, team: SavedTeamOption) => {
      if (key === NEW_TEAM_KEY) {
        teamCreated(team.name);
        return;
      }
      teamSelected(key);
    },
    [teamCreated, teamSelected]
  );

  return (
    <Select
      showSearch
      placeholder="Save or load a new team"
      status={dirty ? 'warning' : ''}
      style={{ minWidth: 150 }}
      filterOption={filterOption}
      searchValue={customName}
      onSearch={setCustomName}
      onSelect={handleSelect}
      value={selectedTeam}
      options={savedTeamOptions}
    />
  );
};
