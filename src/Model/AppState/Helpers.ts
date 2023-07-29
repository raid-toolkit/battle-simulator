import { LeaderStatBonus } from '@raid-toolkit/webclient';
import { assert } from '../../Common';
import { BossSetupByStage } from '../StageInfo';
import { AbilitySetup, AreaId, ChampionSetup } from '../Types';
import { CompatibleTuneState, TuneState } from './AppState';

export function abilityHasMods(ability: AbilitySetup) {
  return (
    ability.effectMods &&
    Object.values(ability.effectMods).some(
      (mod) =>
        mod.disabled ||
        (mod.disabledStatusEffectIndexes && Object.values(mod.disabledStatusEffectIndexes).some((disabled) => disabled))
    )
  );
}

export function sanitizeAbilitySetup(abilitySetup: AbilitySetup): AbilitySetup {
  const { cooldown, index, skillTypeId, opener, priority, effectMods } = abilitySetup;
  return { cooldown, index, skillTypeId, opener, priority, effectMods };
}

export function sanitizeChampionSetup(championSetup: ChampionSetup): ChampionSetup {
  const { abilities, blessing, setKinds, skillOpener, speed, typeId } = championSetup;
  return { abilities: abilities.map(sanitizeAbilitySetup), blessing, setKinds, skillOpener, speed, typeId };
}

export function sanitizeTuneState(tuneState: CompatibleTuneState): TuneState {
  const { boss, championList, randomSeed, chanceMode } = tuneState;
  const stage =
    tuneState.stage ??
    (boss
      ? Number(Object.entries(BossSetupByStage).find(([, bossSetup]) => bossSetup.speed === boss!.speed)?.[0])
      : 10);
  assert(typeof stage === 'number');
  return { stage, championList: championList.map(sanitizeChampionSetup), randomSeed, chanceMode };
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
