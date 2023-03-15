import React from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Grid,
  Input,
  MenuProps,
  Row,
  Space,
} from "antd";
import {
  DeleteOutlined,
  HolderOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { ChampionSelectMenu } from "../Components";
import { AbilityListView } from "./AbilityListView";
import { ChampionSetup } from "../ChampionSetup";
import { ChampionAbilitySetup } from "../ChampionAbilitySetup";

export interface ChampionSetupViewProps {
  index: number;
  setup: Readonly<ChampionSetup>;
  onUpdated: (index: number, value: Readonly<ChampionSetup>) => void;
  onDeleted: (index: number) => void;
}

export function validateSetup(setup: Readonly<ChampionSetup>): string[] {
  const errors: string[] = [];
  if (!setup.typeId) {
    errors.push("Champion is required");
  }
  if (!setup.speed) {
    errors.push("Speed is required");
  }
  if (setup.abilities.length === 0) {
    errors.push("At least one ability is required");
  }
  return errors;
}

export const ChampionSetupView: React.FC<ChampionSetupViewProps> = ({
  index,
  setup,
  onUpdated,
  onDeleted,
}) => {
  const selectTypeId = React.useCallback(
    (typeId?: string) => {
      onUpdated(index, { ...setup, typeId });
    },
    [index, onUpdated, setup]
  );

  const setSpeed = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => onUpdated(index, { ...setup, speed: parseFloat(e.target.value) }),
    [index, onUpdated, setup]
  );

  const onAbilitiesUpdated = React.useCallback(
    (abilities: readonly Readonly<ChampionAbilitySetup>[]) => {
      onUpdated(index, {
        ...setup,
        abilities,
      });
    },
    [index, onUpdated, setup]
  );

  const menu = React.useMemo<MenuProps>(
    () => ({
      items: [
        {
          key: "delete",
          label: "Delete",
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => onDeleted(index),
        },
      ],
    }),
    [index, onDeleted]
  );

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Space.Compact block>
        <Dropdown arrow placement="topLeft" trigger={["click"]} menu={menu}>
          <Button
            icon={<HolderOutlined />}
            style={{
              alignSelf: "stretch",
              height: "unset",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
            }}
          />
        </Dropdown>
        <Space.Compact direction="vertical" style={{ width: "100%" }}>
          <Row>
            <Col span={16}>
              <ChampionSelectMenu
                bordered={false}
                style={{ width: "100%" }}
                selectedValue={setup.typeId}
                onSelect={selectTypeId}
                onClear={selectTypeId}
              />
            </Col>
            <Col span={8}>
              <Input
                bordered={false}
                placeholder="Speed"
                value={setup.speed || undefined}
                onChange={setSpeed}
                suffix={<ThunderboltOutlined />}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <AbilityListView
                abilities={setup.abilities}
                onUpdated={onAbilitiesUpdated}
              />
            </Col>
          </Row>
        </Space.Compact>
      </Space.Compact>
    </Card>
  );
};
