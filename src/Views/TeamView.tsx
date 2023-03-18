import React from "react";
import { ChampionSetupListView } from "./ChampionSetupListView";
import { Badge, Button, Card, Input, Space } from "antd";
import {
  CheckOutlined,
  EditOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useToggle } from "../Components/Hooks";

export const TeamView: React.FC = () => {
  const [editable, toggleEditable] = useToggle(true);
  return (
    <Badge.Ribbon text="Team" placement="start">
      <Card
        style={{ height: "100vh" }}
        bodyStyle={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: 64,
          marginLeft: -40,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex" }}>
            <Space>
              <Input
                addonBefore="Speed Aura"
                suffix="%"
                addonAfter={<ThunderboltOutlined />}
                style={{ width: 200, textAlign: "right" }}
              />
              <Space.Compact>
                <Button
                  type={editable ? "primary" : "default"}
                  icon={editable ? <CheckOutlined /> : <EditOutlined />}
                  onClick={toggleEditable}
                >
                  {editable ? "Done" : "Edit"}
                </Button>
              </Space.Compact>
            </Space>
          </div>
          <ChampionSetupListView editable={editable} />
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};
