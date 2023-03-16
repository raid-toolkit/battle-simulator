import React from "react";
import { Button, Divider, Space } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { validateSetup, ChampionSetupView } from "./ChampionSetupView";
import { ChampionSetup } from "../Model";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";

export const ChampionSetupListView: React.FC = () => {
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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Space
        direction="vertical"
        style={{ display: "flex", flexDirection: "column", margin: 16 }}
      >
        {state.map((setup, index) => (
          <ChampionSetupView
            key={`setup_${index}`}
            index={index}
            setup={setup}
            onUpdated={onUpdated}
            onDeleted={deleteChampion}
          />
        ))}
      </Space>
      <Divider dashed style={{ margin: "0px 0px 16px 0px" }} />
      <Button
        icon={<UserAddOutlined />}
        ghost={allStatesValid}
        type={allStatesValid ? "primary" : "default"}
        style={{ alignSelf: "center" }}
        disabled={state.length >= 5}
        onClick={addChampion}
      ></Button>
    </div>
  );
};
