import React from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { validateSetup, ChampionSetupView } from "./ChampionSetupView";
import { ChampionSetup } from "../Model";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";

export interface ChampionSetupListViewProps {
  editable?: boolean;
}

export const ChampionSetupListView: React.FC<ChampionSetupListViewProps> = ({
  editable,
}) => {
  const [state, setState] = React.useState<readonly Readonly<ChampionSetup>[]>(
    []
  );

  const allStatesValid = state.every(
    (setup) => validateSetup(setup).length === 0
  );

  const onUpdated = React.useCallback((index: number, value: ChampionSetup) => {
    setState((state) => replaceItemAtIndex(state, index, value));
  }, []);

  const addChampion = React.useCallback(() => {
    setState((state) => [...state, { abilities: [] }]);
  }, []);

  const deleteChampion = React.useCallback((index: number) => {
    setState((state) => removeItemAtIndex(state, index));
  }, []);

  const rootRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      {state.map((setup, index) => (
        <ChampionSetupView
          key={`setup_${index}`}
          editable={editable}
          index={index}
          setup={setup}
          onUpdated={onUpdated}
          onDeleted={deleteChampion}
        />
      ))}
      {editable && (
        <Button
          icon={<UserAddOutlined />}
          ghost={allStatesValid}
          type={allStatesValid ? "primary" : "default"}
          style={{ alignSelf: "center" }}
          disabled={state.length >= 5}
          onClick={addChampion}
        >
          Add Champion
        </Button>
      )}
    </div>
  );
};
