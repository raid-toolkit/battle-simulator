import { AbilitySetup, ChampionSetup } from '../Types';
import { TuneState } from './AppState';

export function sanitizeAbilitySetup(abilitySetup: AbilitySetup): AbilitySetup {
  const { cooldown, index, skillTypeId, opener, priority } = abilitySetup;
  return { cooldown, index, skillTypeId, opener, priority };
}

export function sanitizeChampionSetup(championSetup: ChampionSetup): ChampionSetup {
  const { abilities, blessing, skillOpener, speed, typeId } = championSetup;
  return { abilities: abilities.map(sanitizeAbilitySetup), blessing, skillOpener, speed, typeId };
}

export function sanitizeTuneState(tuneState: TuneState): TuneState {
  const {
    boss: { shieldHits, speed, typeId },
    championList,
    speedAura,
  } = tuneState;
  return { boss: { shieldHits, speed, typeId }, championList: championList.map(sanitizeChampionSetup), speedAura };
}
