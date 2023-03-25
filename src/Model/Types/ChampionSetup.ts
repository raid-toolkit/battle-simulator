import { AbilitySetup } from './AbilitySetup';
import { BlessingTypeId } from './RSL';

export interface ChampionSetup {
  typeId?: number;
  speed?: number;
  skillOpener?: number | undefined;
  blessing?: BlessingTypeId | null;
  /** @deprecated */
  baseSpeed?: number;
  abilities: AbilitySetup[];
}
