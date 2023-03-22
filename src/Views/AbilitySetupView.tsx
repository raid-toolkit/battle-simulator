import React, { CSSProperties } from 'react';
import { Button, Input, InputNumber, Select, Space, theme } from 'antd';
import { FlagOutlined, FlagFilled, DeleteOutlined, StopOutlined, HistoryOutlined } from '@ant-design/icons';
import { AbilitySetup } from '../Model';
import { RichString } from '../Components';
import './AbilitySetupView.css';

export interface AbilitySetupViewProps {
  editable?: boolean;
  index: number;
  ability: Readonly<AbilitySetup>;
  abilityCount: number;
  onDeleted?: (index: number) => void;
  onUpdated: (index: number, ability: Readonly<AbilitySetup>) => void;
}

const AbilityPrefix: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = theme.useToken();
  return <span style={{ color: token.colorTextSecondary }}>{children}</span>;
};

export const AbilitySetupView: React.FC<AbilitySetupViewProps> = ({
  editable,
  index,
  ability,
  abilityCount,
  onUpdated,
  onDeleted,
}) => {
  const setPriority = React.useCallback(
    (value?: number) => {
      onUpdated(index, { ...ability, priority: value });
    },
    [index, ability, onUpdated]
  );

  const setCooldown = React.useCallback<(value: number | null) => void>(
    (value) => {
      onUpdated(index, { ...ability, cooldown: value ?? 0 });
    },
    [index, ability, onUpdated]
  );

  const toggleOpener = React.useCallback(() => {
    onUpdated(index, { ...ability, opener: !ability.opener });
  }, [index, ability, onUpdated]);

  const deleteSelf = React.useCallback(() => onDeleted?.(index), [index, onDeleted]);

  const priorityOptions = React.useMemo(
    () =>
      (index === 0 ? [] : [{ label: <StopOutlined style={{ color: 'red' }} />, value: -1 }]).concat(
        Array.from({ length: abilityCount - 1 }).map((_, i) => {
          return { label: <>{`${i + 1}`}</>, value: i + 1 };
        })
      ),
    [index, abilityCount]
  );
  const { token } = theme.useToken();

  return (
    <div className="ability-row">
      <Space.Compact block>
        <Input
          bordered={false}
          autoComplete="off"
          prefix={<AbilityPrefix>A{ability.index + 1}</AbilityPrefix>}
          placeholder={`A${ability.index + 1}`}
          // disabled={!editable}
          style={{ flex: 1, pointerEvents: editable ? 'initial' : 'none' }}
          value={ability.label}
          title={ability.label}
          onChange={(value) => {
            onUpdated(index, { ...ability, label: value.target.value });
          }}
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
        {/* <InputNumber
          placeholder="Hits"
          style={{ width: 90 - (editable ? 0 : 22) }}
          disabled={!editable}
          addonAfter={<CompressOutlined />}
          // suffix={<CompressOutlined />}
          title="# of hits"
          value={!ability.hits ? 0 : ability.hits}
          onChange={setHits}
        /> */}
        {onDeleted && (
          <Button title="Delete" danger style={{ width: 32 }} icon={<DeleteOutlined />} onClick={deleteSelf} />
        )}
      </Space.Compact>
      {editable && ability.description && (
        <div style={{ padding: 8, marginBottom: 16 }}>
          <RichString>{ability.description}</RichString>
        </div>
      )}
    </div>
  );
};
