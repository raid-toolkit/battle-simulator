import React from 'react';
import { Button, Dropdown, InputNumber, MenuProps, Space, theme } from 'antd';
import { DeleteOutlined, EditOutlined, HolderOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { ChampionSelectMenu } from '../Components';
import { AbilitySetupListView } from './AbilitySetupListView';
import { ChampionSetup, AbilitySetup, lookupChampionSetup } from '../Model';
import { useToggle } from '../Components/Hooks';
import './ChampionSetupView.css';

export interface ChampionSetupViewProps {
  index: number;
  setup: Readonly<ChampionSetup>;
  editable?: boolean;
  onUpdated: (index: number, value: Readonly<ChampionSetup>) => void;
  onDeleted: (index: number) => void;
}

export const ChampionSetupView: React.FC<ChampionSetupViewProps> = ({
  index,
  setup,
  onUpdated,
  onDeleted,
  editable,
}) => {
  const [skillsEditable, toggleSkillsEditable] = useToggle();

  const { token } = theme.useToken();
  const selectTypeId = React.useCallback(
    (typeId?: number) => {
      if (typeId === undefined) {
        // reset the whole thing
        onUpdated(index, { abilities: [] });
      } else if (setup.typeId !== typeId) {
        const lookup = lookupChampionSetup(typeId);
        if (lookup) {
          onUpdated(index, lookup);
          return;
        }
        onUpdated(index, { ...setup, typeId });
      }
    },
    [index, onUpdated, setup]
  );

  const setSpeed = React.useCallback(
    (value: number | null) => {
      onUpdated(index, { ...setup, speed: value || 0 });
    },
    [index, onUpdated, setup]
  );

  const onAbilitiesUpdated = React.useCallback(
    (abilities: readonly Readonly<AbilitySetup>[]) => {
      onUpdated(index, {
        ...setup,
        abilities,
      });
    },
    [index, onUpdated, setup]
  );

  const menu = React.useMemo<MenuProps>(
    () => ({
      items: [
        {
          key: 'delete',
          label: 'Delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => onDeleted(index),
        },
      ],
    }),
    [index, onDeleted]
  );

  return (
    <div className="champion-setup-card" style={{ margin: '8px 0px' }} tabIndex={0}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div className="ability-row">
          <Space.Compact block>
            <ChampionSelectMenu
              bordered={false}
              status={setup.typeId ? '' : 'warning'}
              style={{ flex: 1 }}
              selectedValue={setup.typeId}
              onSelect={selectTypeId}
              onClear={selectTypeId}
            />
            <InputNumber
              bordered={false}
              className="ant-input-compact-item ant-input-compact-last-item"
              status={setup.speed ? '' : 'warning'}
              style={{ width: 90, textAlign: 'right' }}
              value={setup.speed || undefined}
              onChange={setSpeed}
              prefix={<ThunderboltOutlined />}
              // addonBefore="Speed"
              min={70}
              max={600}
              step={1}
              // addonAfter={<ThunderboltOutlined />}
              // suffix={<ThunderboltOutlined />}
            />
          </Space.Compact>
        </div>
        <AbilitySetupListView editable={skillsEditable} abilities={setup.abilities} onUpdated={onAbilitiesUpdated} />
      </div>
      <div
        className="champion-setup-card-actions"
        style={{
          position: 'absolute',
          left: -40,
          width: 40,
          top: 0,
          bottom: 0,
        }}
      >
        <Space.Compact
          direction="vertical"
          style={{
            position: 'absolute',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <Dropdown arrow placement="topLeft" trigger={['click']} menu={menu}>
            <Button icon={<HolderOutlined />} />
          </Dropdown>
          <Button
            title="Edit skills"
            icon={<EditOutlined />}
            type={skillsEditable ? 'primary' : 'default'}
            onClick={toggleSkillsEditable}
          />
          <Button icon={<DeleteOutlined />} style={{ color: token.colorError }} onClick={() => onDeleted(index)} />
        </Space.Compact>
      </div>
    </div>
  );
};
