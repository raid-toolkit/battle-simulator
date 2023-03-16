import React from "react";
import { Select } from "antd";
import { useAsyncDataSource } from "../Hooks";
import "./ChampionSelectMenu.css";
import { heroTypesDataSource } from "../DataSources/HeroTypesDataSource";
import { HeroType } from "@raid-toolkit/webclient";
import { Avatar } from "../Avatar/Avatar";

export interface ChampionSelectMenuProps {
  bordered?: boolean;
  style?: React.CSSProperties;
  selectedValue?: number;
  onClear?: () => void;
  onSelect: (
    typeId: number | undefined,
    heroType: HeroType | undefined
  ) => void;
}

export interface ChampionSelectItemProps {
  readonly value: number;
  readonly heroType: HeroType;
  readonly label: JSX.Element;
  readonly children: JSX.Element;
  match(value: string): boolean;
}

function heroTypeToOption([, heroType]: [
  id: string,
  heroType: HeroType
]): ChampionSelectItemProps {
  return {
    heroType,
    value: heroType.typeId,
    match(value: string) {
      return heroType.name.defaultValue
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase());
    },
    get label() {
      return (
        <div className="champion-select-item">
          <Avatar height="1em" width="1em" id={heroType.avatarKey} />
          {heroType.name.defaultValue}
        </div>
      );
    },
    get children() {
      return this.label;
    },
  };
}

export const ChampionSelectMenu: React.FC<ChampionSelectMenuProps> = ({
  onSelect,
  onClear,
  selectedValue,
  style,
  bordered,
}) => {
  const heroTypes = useAsyncDataSource(heroTypesDataSource);
  const options = React.useMemo(
    () => heroTypes.map(heroTypeToOption),
    [heroTypes]
  );
  const handleSelect = React.useCallback(
    (_: unknown, value?: ChampionSelectItemProps) => {
      onSelect(value?.value, value?.heroType);
    },
    [onSelect]
  );
  const styleMemo = React.useMemo(() => ({ ...style }), [style]);
  return (
    <Select
      bordered={bordered}
      showSearch
      menuItemSelectedIcon
      allowClear={!!onClear}
      placeholder="Select a champion"
      optionLabelProp="label"
      style={styleMemo}
      onClear={onClear}
      filterOption={(input, option) => !!option?.match(input)}
      options={options}
      value={selectedValue}
      onSelect={handleSelect}
    />
  );
};
