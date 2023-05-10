import { ArtifactSetKindId } from '@raid-toolkit/webclient';
import { AbilitySetup } from './AbilitySetup';
import { BlessingTypeId } from './RSL';

export interface ChampionSetup {
  typeId?: number;
  speed?: number;
  skillOpener?: number | undefined;
  blessing?: BlessingTypeId | null;
  setKinds?: ArtifactSetKindId[];
  abilities: AbilitySetup[];
}
