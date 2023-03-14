import React from "react";
import { Select } from "antd";
import { useAsyncDataSource } from "../Hooks";
import "./ChampionSelectMenu.css";
import { heroTypesDataSource } from "../DataSources/HeroTypesDataSource";
import { HeroType } from "@raid-toolkit/webclient";
import { Avatar } from "../Avatar/Avatar";

export interface ChampionSelectMenuProps {
  style?: React.CSSProperties;
  selectedValue?: string;
  onSelect?: (
    typeId: string | undefined,
    heroType: HeroType | undefined
  ) => void;
}

export interface ChampionSelectItemProps {
  readonly value: string;
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
    value: heroType.typeId.toString(),
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
  selectedValue,
  style,
}) => {
  const heroTypes = useAsyncDataSource(heroTypesDataSource);
  const options = React.useMemo(
    () => heroTypes.map(heroTypeToOption),
    [heroTypes]
  );
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const handleSelect = React.useCallback(
    (_: unknown, value?: ChampionSelectItemProps) => {
      setValue(value?.value);
      onSelect?.(value?.value, value?.heroType);
    },
    [onSelect]
  );
  const styleMemo = React.useMemo(() => ({ width: 300, ...style }), [style]);
  return (
    <Select
      showSearch
      menuItemSelectedIcon
      allowClear
      placeholder="Select a champion"
      optionLabelProp="label"
      size="large"
      style={styleMemo}
      filterOption={(input, option) => !!option?.match(input)}
      options={options}
      value={selectedValue ?? value}
      onSelect={handleSelect}
    />
  );
};
