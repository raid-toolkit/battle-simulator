import { LeaderStatBonus } from '@raid-toolkit/webclient';
import { assert } from '../../Common';
import { BossSetupByStage } from '../StageInfo';
import { AbilitySetup, AreaId, ChampionSetup } from '../Types';
import { CompatibleTuneState, TuneState } from './AppState';

export function sanitizeAbilitySetup(abilitySetup: AbilitySetup): AbilitySetup {
  const { cooldown, index, skillTypeId, opener, priority } = abilitySetup;
  return { cooldown, index, skillTypeId, opener, priority };
}

export function sanitizeChampionSetup(championSetup: ChampionSetup): ChampionSetup {
  const { abilities, blessing, skillOpener, speed, typeId } = championSetup;
  return { abilities: abilities.map(sanitizeAbilitySetup), blessing, skillOpener, speed, typeId };
}

export function sanitizeTuneState(tuneState: CompatibleTuneState): TuneState {
  const { boss, championList } = tuneState;
  const stage =
    tuneState.stage ??
    (boss
      ? Number(Object.entries(BossSetupByStage).find(([, bossSetup]) => bossSetup.speed === boss!.speed)?.[0])
      : 10);
  assert(typeof stage === 'number');
  return { stage, championList: championList.map(sanitizeChampionSetup) };
}

declare module '@raid-toolkit/webclient' {
  export interface LeaderStatBonus {
    /** @deprecated */
    areaTypeId: string;
    area: AreaId;
  }
}

export function isAuraApplicable(leaderSkill: LeaderStatBonus | undefined, areaId: AreaId) {
  return leaderSkill && (!leaderSkill.area || leaderSkill.area?.toLocaleLowerCase() === areaId);
}

export function assertValidChampionSetup(setup: ChampionSetup): asserts setup is Readonly<Required<ChampionSetup>> {
  assert(setup.speed !== undefined && setup.typeId !== undefined);
}
