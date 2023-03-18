import React from "react";
import { Button, theme } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { AbilitySetupView } from "./AbilitySetupView";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";
import { AbilitySetup } from "../Model";

export interface AbilitiyListProps {
  editable?: boolean;
  abilities: readonly Readonly<AbilitySetup>[];
  onUpdated: (abilities: readonly Readonly<AbilitySetup>[]) => void;
}

export const AbilitySetupListView: React.FC<AbilitiyListProps> = ({
  abilities,
  onUpdated,
  editable,
}) => {
  const { token } = theme.useToken();
  const addAbility = React.useCallback(() => {
    onUpdated([
      ...abilities,
      {
        index: abilities.length,
        label: `A${abilities.length + 1}`,
        cooldown: abilities.length ? 2 : 0,
        hits: abilities.length ? 1 : 0,
        opener: false,
        priority: undefined,
      },
    ]);
  }, [abilities, onUpdated]);

  const updateAbility = React.useCallback(
    (index: number, ability: Readonly<AbilitySetup>) => {
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {abilities.map((ability, index) => (
        <AbilitySetupView
          editable={editable}
          key={`ability_${index}`}
          index={index}
          ability={ability}
          abilityCount={abilities.length}
          onUpdated={updateAbility}
          onDeleted={editable ? deleteAbility : undefined}
        />
      ))}
      {abilities.length === 0 && (
        <div
          style={{
            margin: 16,
            textAlign: "center",
            color: token.colorTextDisabled,
          }}
        >
          Abilities will display when a champion is selected
        </div>
      )}
      {editable && (
        <Button
          style={{ alignSelf: "end" }}
          type="text"
          icon={<PlusCircleOutlined />}
          onClick={addAbility}
        >
          Add Ability
        </Button>
      )}
    </div>
  );
};
