import React from "react";
import { ChampionSetupListView } from "./ChampionSetupListView";
import { Badge, Button, Card, Input, Space } from "antd";
import {
  CheckOutlined,
  EditOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useToggle } from "../Components/Hooks";
import { ChampionSetup } from "../Model";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";

export const TeamView: React.FC = () => {
  const [championList, setChampionList] = React.useState<
    readonly Readonly<ChampionSetup>[]
  >([]);

  const updateChampion = React.useCallback(
    (index: number, value: ChampionSetup) => {
      setChampionList((state) => replaceItemAtIndex(state, index, value));
    },
    []
  );

  const addChampion = React.useCallback(() => {
    setChampionList((state) => [...state, { abilities: [] }]);
  }, []);

  const deleteChampion = React.useCallback((index: number) => {
    setChampionList((state) => removeItemAtIndex(state, index));
  }, []);

  return (
    <Badge.Ribbon text="Team" placement="start">
      <Card
        style={{ height: "100vh" }}
        bodyStyle={{
          height: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex" }}>
            <Space>
              <Input
                addonBefore="Speed Aura"
                suffix="%"
                defaultValue={0}
                addonAfter={<ThunderboltOutlined />}
                style={{ width: 200, textAlign: "right" }}
              />
              <Space.Compact>
                <Button
                  title="Add Champion"
                  icon={<UserAddOutlined />}
                  onClick={addChampion}
                />
              </Space.Compact>
            </Space>
          </div>
          <ChampionSetupListView
            items={championList}
            editable={true}
            addChampion={addChampion}
            deleteChampion={deleteChampion}
            updateChampion={updateChampion}
          />
        </div>
      </Card>
    </Badge.Ribbon>
  );
};
