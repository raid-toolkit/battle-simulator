import React from "react";
import { ChampionSetupListView } from "./ChampionSetupListView";
import { Badge, Button, Card, Input, Space } from "antd";
import { ThunderboltOutlined, UserAddOutlined } from "@ant-design/icons";
import { ChampionSetup } from "../Model";
import { removeItemAtIndex, replaceItemAtIndex } from "../Common";

export interface TeamViewProps {
  readonly championList: readonly Readonly<ChampionSetup>[];
  onChampionListUpdated: (
    championList: readonly Readonly<ChampionSetup>[]
  ) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  championList,
  onChampionListUpdated,
}) => {
  const updateChampion = React.useCallback(
    (index: number, value: ChampionSetup) => {
      onChampionListUpdated(replaceItemAtIndex(championList, index, value));
    },
    [championList, onChampionListUpdated]
  );

  const addChampion = React.useCallback(() => {
    onChampionListUpdated([...championList, { abilities: [] }]);
  }, [championList, onChampionListUpdated]);

  const deleteChampion = React.useCallback(
    (index: number) => {
      onChampionListUpdated(removeItemAtIndex(championList, index));
    },
    [championList, onChampionListUpdated]
  );

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
                  disabled={championList.length >= 5}
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
