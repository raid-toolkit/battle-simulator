import React from "react";
import { Button, Input, Select, Space } from "antd";
import {
  FlagOutlined,
  FlagFilled,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ChampionAbilitySetup } from "../ChampionAbilitySetup";

export interface AbilitySetupViewProps {
  index: number;
  ability: Readonly<ChampionAbilitySetup>;
  abilityCount: number;
  onDeleted: (index: number) => void;
  onUpdated: (index: number, ability: Readonly<ChampionAbilitySetup>) => void;
}

export const AbilitySetupView: React.FC<AbilitySetupViewProps> = ({
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

  const setCooldown = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      onUpdated(index, { ...ability, cooldown: parseInt(e.target.value, 10) });
    },
    [index, ability, onUpdated]
  );

  const setHits = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onUpdated(index, { ...ability, hits: parseInt(e.target.value, 10) });
    },
    [index, ability, onUpdated]
  );

  const toggleOpener = React.useCallback(() => {
    onUpdated(index, { ...ability, opener: !ability.opener });
  }, [index, ability, onUpdated]);

  const deleteSelf = React.useCallback(
    () => onDeleted(index),
    [index, onDeleted]
  );

  const priorityOptions = React.useMemo(
    () =>
      [
        { label: <CheckCircleOutlined />, value: undefined },
        { label: <StopOutlined />, value: -1 },
      ].concat(
        Array.from({ length: abilityCount }).map((_, i) => {
          return { label: <>{`${i + 1}`}</>, value: i + 1 };
        })
      ),
    [abilityCount]
  );

  return (
    <Space.Compact key={`ability_${index}`}>
      <Input
        placeholder={`A${index + 1}`}
        style={{ flex: 2 }}
        value={ability.label}
        onChange={(value) => {
          onUpdated(index, { ...ability, label: value.target.value });
        }}
      />
      <Select
        allowClear
        value={ability.priority}
        placeholder="Priority"
        style={{ width: 65 }}
        options={priorityOptions}
        onClear={setPriority}
        onChange={setPriority}
      />
      <Input
        placeholder="CD"
        title="Cooldown"
        style={{ flex: 1 }}
        value={isNaN(ability.cooldown) ? "" : ability.cooldown}
        status={isNaN(ability.cooldown) ? "error" : undefined}
        onChange={setCooldown}
      />
      <Button
        title="Opener"
        style={{ flex: 1 }}
        type={ability.opener ? "primary" : "default"}
        icon={ability.opener ? <FlagFilled /> : <FlagOutlined />}
        onClick={toggleOpener}
      />
      <Input
        placeholder="Hits"
        title="# of hits"
        style={{ flex: 1 }}
        value={isNaN(ability.hits) || ability.hits === 0 ? "" : ability.hits}
        onChange={setHits}
      />
      <Button
        title="Delete"
        danger
        style={{ flex: 1 }}
        icon={<DeleteOutlined />}
        onClick={deleteSelf}
      />
    </Space.Compact>
  );
};
