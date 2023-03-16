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
import { AbilitySetupListView } from "./AbilitySetupListView";
import { ChampionSetup, AbilitySetup, lookupChampionSetup } from "../Model";

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
    (typeId?: number) => {
      if (typeId === undefined) {
        // reset the whole thing
        onUpdated(index, { abilities: [] });
      } else if (setup.typeId !== typeId) {
        const lookup = lookupChampionSetup(typeId);
        if (lookup) {
          onUpdated(index, lookup);
          return;
        }
        onUpdated(index, { ...setup, typeId });
      }
    },
    [index, onUpdated, setup]
  );

  const setSpeed = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) =>
      onUpdated(index, { ...setup, speed: parseFloat(e.target.value) || 0 }),
    [index, onUpdated, setup]
  );

  const onAbilitiesUpdated = React.useCallback(
    (abilities: readonly Readonly<AbilitySetup>[]) => {
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
    <Card bodyStyle={{ padding: 0 }} tabIndex={0}>
      <Space.Compact block>
        <Dropdown arrow placement="topLeft" trigger={["click"]} menu={menu}>
          <Button
            icon={<HolderOutlined />}
            style={{
              alignSelf: "stretch",
              height: "unset",
              width: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
            }}
          />
        </Dropdown>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 8,
            flex: 1,
          }}
        >
          <Space.Compact block>
            <ChampionSelectMenu
              bordered={false}
              style={{ flex: 1 }}
              selectedValue={setup.typeId}
              onSelect={selectTypeId}
              onClear={selectTypeId}
            />
            <Input
              bordered={false}
              placeholder="Speed"
              style={{ width: 80 }}
              value={setup.speed || undefined}
              onChange={setSpeed}
              prefix={<ThunderboltOutlined />}
            />
          </Space.Compact>
          <AbilitySetupListView
            abilities={setup.abilities}
            onUpdated={onAbilitiesUpdated}
          />
        </div>
      </Space.Compact>
    </Card>
  );
};
