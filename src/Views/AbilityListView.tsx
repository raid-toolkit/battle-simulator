import React from "react";
import { Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ChampionAbilitySetup } from "../ChampionAbilitySetup";
import { AbilitySetupView } from "./AbilitySetupView";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";

export interface AbilitiyListProps {
  abilities: readonly Readonly<ChampionAbilitySetup>[];
  onUpdated: (abilities: readonly Readonly<ChampionAbilitySetup>[]) => void;
}

export const AbilityListView: React.FC<AbilitiyListProps> = ({
  abilities,
  onUpdated,
}) => {
  const addAbility = React.useCallback(() => {
    onUpdated([
      ...abilities,
      {
        label: `A${abilities.length + 1}`,
        cooldown: abilities.length ? 2 : 0,
        hits: abilities.length ? 1 : 0,
        opener: false,
        priority: undefined,
      },
    ]);
  }, [abilities, onUpdated]);

  const updateAbility = React.useCallback(
    (index: number, ability: Readonly<ChampionAbilitySetup>) => {
      onUpdated(replaceItemAtIndex(abilities, index, ability));
    },
    [abilities, onUpdated]
  );

  const deleteAbility = React.useCallback(
    (index: number) => {
      onUpdated(removeItemAtIndex(abilities, index));
    },
    [abilities, onUpdated]
  );
  return (
    <div
      style={{ display: "flex", flexDirection: "column", padding: "0px 8px" }}
    >
      {abilities.map((ability, index) => (
        <AbilitySetupView
          key={`ability_${index}`}
          index={index}
          ability={ability}
          abilityCount={abilities.length}
          onUpdated={updateAbility}
          onDeleted={deleteAbility}
        />
      ))}
      <Button
        style={{ alignSelf: "end" }}
        type="text"
        icon={<PlusCircleOutlined />}
        onClick={addAbility}
      >
        Add Ability
      </Button>
    </div>
  );
};
