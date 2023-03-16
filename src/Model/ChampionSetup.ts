import { AbilitySetup } from "./AbilitySetup";

export interface ChampionSetup {
  typeId?: number;
  speed?: number;
  abilities: readonly Readonly<AbilitySetup>[];
}
