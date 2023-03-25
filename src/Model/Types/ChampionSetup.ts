import { AbilitySetup } from './AbilitySetup';

export interface ChampionSetup {
  typeId?: number;
  speed?: number;
  /** @deprecated */
  baseSpeed?: number;
  abilities: AbilitySetup[];
}
