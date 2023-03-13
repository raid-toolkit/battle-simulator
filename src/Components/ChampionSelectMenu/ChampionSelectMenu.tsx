import React from "react";
import { RTK } from "../../Data";
import { Select } from "antd";
import { Avatar } from "../Avatar/Avatar";
import { HeroType } from "@raid-toolkit/webclient";
import { createAsyncDataSource, useAsyncDataSource } from "../Hooks";

export interface ChampionSelectMenuProps {}

export interface ChampionSelectItemProps {
  value: string;
  readonly label: JSX.Element;
  readonly children: JSX.Element;
  match(value: string): boolean;
}

function heroTypeToOption([, heroType]: [
  id: string,
  heroType: HeroType
]): ChampionSelectItemProps {
  return {
    value: heroType.typeId.toString(),
    match(value: string) {
      return heroType.name.defaultValue
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase());
    },
    get label() {
      return (
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Avatar
            height="1em"
            width="1em"
            id={(heroType.typeId - (heroType.typeId % 10)).toString()}
          />
          {heroType.name.defaultValue}
        </div>
      );
    },
    get children() {
      return this.label;
    },
  };
}

const heroTypes = createAsyncDataSource(() => {
  return RTK.wait().then((rtk) => {
    return Object.entries(rtk.heroTypes)
      .filter(([id]) => parseInt(id, 10) % 10 === 0)
      .map(heroTypeToOption);
  });
}, []);

export const ChampionSelectMenu: React.FC<ChampionSelectMenuProps> = (
  props
) => {
  const options = useAsyncDataSource(heroTypes);
  return (
    <Select
      showSearch
      menuItemSelectedIcon
      allowClear
      placeholder="Select a champion"
      optionLabelProp="label"
      size="large"
      style={{ width: 300 }}
      filterOption={(input, option) => !!option?.match(input)}
      options={options}
    />
  );
};
