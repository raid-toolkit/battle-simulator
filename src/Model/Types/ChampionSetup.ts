import { AbilitySetup } from './AbilitySetup';

export interface ChampionSetup {
  typeId?: number;
  speed?: number;
  baseSpeed?: number;
  abilities: readonly Readonly<AbilitySetup>[];
}
