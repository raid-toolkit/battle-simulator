import React from 'react';
import { Button, Input, InputNumber, Select, Space, theme } from 'antd';
import { FlagOutlined, FlagFilled, StopOutlined, HistoryOutlined } from '@ant-design/icons';
import { useAppModel } from '../Model';
import { RichString } from '../Components';
import './AbilitySetupView.css';
import { RTK } from '../Data';

export interface AbilitySetupViewProps {
  skillTypeId: number;
  ownerIndex: number;
  abilityIndex: number;
}

export const AbilitySetupView: React.FC<AbilitySetupViewProps> = ({ skillTypeId, ownerIndex, abilityIndex }) => {
  const { state, dispatch } = useAppModel();
  const { token } = theme.useToken();
  const owner = state.tuneState.championList[ownerIndex];
  const abilityCount = owner.abilities.length;
  const ability = owner.abilities[abilityIndex];
  const staticAbility = RTK.skillTypes[skillTypeId];

  const isHighlighted = state.highlight && state.highlight[0] === ownerIndex && state.highlight[1] === abilityIndex;
  const toggleHighlight = React.useCallback(
    (e: React.MouseEvent) => {
      if (isHighlighted) {
        dispatch.setHighlight();
      } else {
        dispatch.setHighlight(ownerIndex, abilityIndex);
      }
      e.stopPropagation();
      e.preventDefault();
    },
    [dispatch, isHighlighted, ownerIndex, abilityIndex]
  );

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
    dispatch.toggleSkillOpener(ownerIndex, abilityIndex);
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

  const [showDescription, setShowDescription] = React.useState(false);

  const displayName = RTK.getString(staticAbility.name);
  const description = RTK.getString(staticAbility.description);
  return (
    <div className="ability-row">
      <Space.Compact block>
        <span onClick={() => setShowDescription((value) => !value)} className="ability-title">
          <span className={`ability-slot ${isHighlighted ? 'ability-slot-highlight' : ''}`} onClick={toggleHighlight}>
            A{ability.index + 1}
          </span>
          <span>{displayName}</span>
        </span>
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
          icon={
            owner.skillOpener === abilityIndex ? <FlagFilled style={{ color: token.colorPrimary }} /> : <FlagOutlined />
          }
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
          onChange={abilityIndex > 0 ? setCooldown : undefined}
        />
      </Space.Compact>
      {showDescription && description && (
        <div className="skill-description-box">
          <div className="skill-description">
            <RichString>{description}</RichString>
          </div>
        </div>
      )}
    </div>
  );
};
