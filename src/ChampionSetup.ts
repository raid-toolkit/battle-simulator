import { ChampionAbilitySetup } from "./ChampionAbilitySetup";

export interface ChampionSetup {
  typeId?: string;
  speed?: number;
  abilities: readonly Readonly<ChampionAbilitySetup>[];
}
