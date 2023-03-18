import React from "react";
import { ChampionSetup } from "../Model";

export interface TurnSimulatorProps {
  championList: readonly Readonly<ChampionSetup>[];
  bossSpeed: number;
}

export const TurnSimulator: React.FC<TurnSimulatorProps> = ({
  championList,
  bossSpeed,
}) => {
  return <div></div>;
};
