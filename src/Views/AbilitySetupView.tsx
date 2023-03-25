import React from 'react';
import { Button, Input, InputNumber, Select, Space, theme } from 'antd';
import { FlagOutlined, FlagFilled, StopOutlined, HistoryOutlined } from '@ant-design/icons';
import { useAppModel } from '../Model';
import { RichString } from '../Components';
import './AbilitySetupView.css';
import { RTK } from '../Data';

export interface AbilitySetupViewProps {
  skillTypeId: number;
  editable?: boolean;
  ownerIndex: number;
  abilityIndex: number;
}

const AbilityPrefix: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = theme.useToken();
  return <span style={{ color: token.colorTextSecondary }}>{children}</span>;
};

export const AbilitySetupView: React.FC<AbilitySetupViewProps> = ({
  skillTypeId,
  editable,
  ownerIndex,
  abilityIndex,
}) => {
  const { state, dispatch } = useAppModel();
  const owner = state.tuneState.championList[ownerIndex];
  const abilityCount = owner.abilities.length;
  const ability = owner.abilities[abilityIndex];
  const staticAbility = RTK.skillTypes[skillTypeId];

  const setPriority = React.useCallback(
    (value?: number) => {
      dispatch.updateChampionSkill(ownerIndex, abilityIndex, (ability) => {
        ability.priority = value;
      });
    },
    [abilityIndex, ownerIndex, dispatch]
  );

  const setCooldown = React.useCallback<(value: number | null) => void>(
    (value) => {
      dispatch.updateChampionSkill(ownerIndex, abilityIndex, (ability) => {
        ability.cooldown = value || 0;
      });
    },
    [abilityIndex, ownerIndex, dispatch]
  );

  const toggleOpener = React.useCallback(() => {
    dispatch.updateChampionSkill(ownerIndex, abilityIndex, (ability) => {
      ability.opener = !ability.opener;
    });
  }, [abilityIndex, ownerIndex, dispatch]);

  const priorityOptions = React.useMemo(
    () =>
      (abilityIndex === 0 ? [] : [{ label: <StopOutlined style={{ color: 'red' }} />, value: -1 }]).concat(
        Array.from({ length: abilityCount - 1 }).map((_, i) => {
          return { label: <>{`${i + 1}`}</>, value: i + 1 };
        })
      ),
    [abilityIndex, abilityCount]
  );
  const { token } = theme.useToken();

  const displayName = RTK.getString(staticAbility.name);
  const description = RTK.getString(staticAbility.description);
  return (
    <div className="ability-row">
      <Space.Compact block>
        <Input
          bordered={false}
          autoComplete="off"
          prefix={<AbilityPrefix>A{ability.index + 1}</AbilityPrefix>}
          placeholder={`A${ability.index + 1}`}
          style={{ flex: 1, pointerEvents: editable ? 'initial' : 'none' }}
          value={displayName}
          title={displayName}
        />
        {ability.index === 0 ? (
          <span
            style={{
              cursor: 'default',
              width: 60,
              textAlign: 'center',
              fontSize: 22,
              lineHeight: '22px',
              alignSelf: 'center',
              paddingBottom: 3,
              color: token.colorTextDisabled,
            }}
          >
            ∞
          </span>
        ) : (
          <Select
            allowClear
            bordered={false}
            value={ability.priority}
            placeholder="Pri"
            style={{ width: 60 }}
            options={priorityOptions}
            onClear={setPriority}
            onChange={setPriority}
          />
        )}
        <Button
          title="Opener"
          style={{ width: 32 }}
          type="text"
          icon={ability.opener ? <FlagFilled style={{ color: token.colorPrimary }} /> : <FlagOutlined />}
          onClick={toggleOpener}
        />
        <InputNumber
          className="ant-input-compact-item ant-input-compact-last-item"
          bordered={false}
          placeholder="CD"
          // addonAfter={<HistoryOutlined />}
          prefix={<HistoryOutlined />}
          title="Cooldown"
          style={{ width: 75 }}
          value={isNaN(ability.cooldown) ? 0 : ability.cooldown}
          status={isNaN(ability.cooldown) ? 'error' : undefined}
          onChange={setCooldown}
        />
      </Space.Compact>
      {editable && description && (
        <div style={{ padding: 8, marginBottom: 16 }}>
          <RichString>{description}</RichString>
        </div>
      )}
    </div>
  );
};
