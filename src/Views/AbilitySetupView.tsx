import React from 'react';
import { Button, Input, InputNumber, Select, Space, theme } from 'antd';
import {
  FlagOutlined,
  FlagFilled,
  DeleteOutlined,
  StopOutlined,
  HistoryOutlined,
  CompressOutlined,
} from '@ant-design/icons';
import { AbilitySetup } from '../Model';
import { RichString } from '../Components';

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

  const setHits = React.useCallback<(value: number | null) => void>(
    (value) => {
      editable && onUpdated(index, { ...ability, hits: value ?? 0 });
    },
    [index, ability, onUpdated, editable]
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

  return (
    <div>
      <Space.Compact block>
        <Input
          autoComplete="off"
          addonBefore={<AbilityPrefix>A{ability.index + 1}</AbilityPrefix>}
          placeholder={`A${ability.index + 1}`}
          disabled={!editable}
          style={{ flex: 1, borderRadius: 0 }}
          value={ability.label}
          title={ability.label}
          onChange={(value) => {
            onUpdated(index, { ...ability, label: value.target.value });
          }}
        />
        <Select
          allowClear
          showArrow={editable}
          value={ability.priority}
          placeholder="Pri"
          style={{ width: 60 }}
          options={priorityOptions}
          onClear={setPriority}
          onChange={setPriority}
        />
        <Button
          title="Opener"
          style={{ width: 32 }}
          type={ability.opener ? 'primary' : 'default'}
          icon={ability.opener ? <FlagFilled /> : <FlagOutlined />}
          onClick={toggleOpener}
        />
        <InputNumber
          placeholder="CD"
          addonAfter={<HistoryOutlined />}
          // suffix={<HistoryOutlined />}
          title="Cooldown"
          style={{ width: 90 }}
          value={isNaN(ability.cooldown) ? 0 : ability.cooldown}
          status={isNaN(ability.cooldown) ? 'error' : undefined}
          onChange={setCooldown}
        />
        <InputNumber
          placeholder="Hits"
          style={{ width: 90 - (editable ? 0 : 22) }}
          disabled={!editable}
          addonAfter={<CompressOutlined />}
          // suffix={<CompressOutlined />}
          title="# of hits"
          value={!ability.hits ? 0 : ability.hits}
          onChange={setHits}
        />
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
