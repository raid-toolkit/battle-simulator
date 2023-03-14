import React from "react";
import { Button, Card, Switch, Input, Select, Space } from "antd";
import {
  FlagOutlined,
  FlagFilled,
  DeleteOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { ChampionSelectMenu } from "./Components";

export interface ChampionAbilityValue {
  label: string;
  priority: number;
  cooldown: number;
  opener: boolean;
  hits: number;
}

export interface ChampionSetupValue {
  typeId: string;
  speed: number;
  abilities: ChampionAbilityValue[];
}

export interface ChampionSetupProps {
  index: number;
  onUpdated?: (index: number, value: ChampionSetupValue) => void;
}

export interface AbilitiyListProps {
  abilities: ChampionAbilityValue[];
  onUpdated?: (abilities: ChampionAbilityValue[]) => void;
}

export const AbilityList: React.FC<AbilitiyListProps> = ({
  abilities,
  onUpdated,
}) => {
  return (
    <Space.Compact direction="vertical">
      {abilities.map((ability, index) => (
        <Space.Compact key={`ability_${index}`}>
          <Input
            placeholder="A1"
            style={{ flex: 2 }}
            value={ability.label}
            onChange={(value) => {
              ability.label = value.target.value;
              onUpdated?.(abilities);
            }}
          />
          <Select
            value={ability.priority}
            placeholder="Priority"
            options={[
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
              { label: "5", value: 5 },
            ]}
            onChange={(value) => {
              ability.priority = value;
              onUpdated?.(abilities);
            }}
          />
          <Input
            placeholder="CD"
            title="Cooldown"
            style={{ flex: 1 }}
            value={isNaN(ability.cooldown) ? "" : ability.cooldown}
            status={isNaN(ability.cooldown) ? "error" : undefined}
            onChange={(value) => {
              ability.cooldown = parseInt(value.target.value, 10);
              onUpdated?.(abilities);
            }}
          />
          <Button
            title="Opener"
            style={{ flex: 1 }}
            type={ability.opener ? "primary" : "default"}
            icon={ability.opener ? <FlagFilled /> : <FlagOutlined />}
            onClick={() => {
              const set = !ability.opener;
              if (set) {
                for (const a of abilities) {
                  a.opener = false;
                }
              }
              ability.opener = set;
              onUpdated?.(abilities);
            }}
          />
          <Input
            placeholder="Hits"
            title="# of hits"
            style={{ flex: 1 }}
            value={
              isNaN(ability.hits) || ability.hits === 0 ? "" : ability.hits
            }
            onChange={(value) => {
              ability.hits = parseInt(value.target.value, 10);
              onUpdated?.(abilities);
            }}
          />
          <Button
            title="Delete"
            danger
            style={{ flex: 1 }}
            icon={<DeleteOutlined />}
            onClick={() => {
              onUpdated?.(abilities.filter((item) => item !== ability));
            }}
          />
        </Space.Compact>
      ))}
      <Button
        onClick={() =>
          onUpdated?.([
            ...abilities,
            {
              label: `A${abilities.length + 1}`,
              cooldown: 1,
              hits: 1,
              opener: false,
              priority: abilities.length,
            },
          ])
        }
      >
        Add Ability
      </Button>
    </Space.Compact>
  );
};

export const ChampionSetup: React.FC<ChampionSetupProps> = ({ index }) => {
  const [state, setState] = React.useState<ChampionSetupValue>({
    typeId: "200",
    speed: 100,
    abilities: [],
  });
  return (
    <Card>
      <Space.Compact direction="vertical" style={{ width: 300 }}>
        <Space.Compact>
          <ChampionSelectMenu style={{ width: "initial", flex: 1 }} />
          <Input
            style={{ width: 100 }}
            placeholder="Speed"
            suffix={<ThunderboltOutlined />}
          />
        </Space.Compact>
        <AbilityList
          abilities={state.abilities}
          onUpdated={(newAbilities) =>
            setState({ ...state, abilities: [...newAbilities] })
          }
        />
      </Space.Compact>
    </Card>
  );
};
