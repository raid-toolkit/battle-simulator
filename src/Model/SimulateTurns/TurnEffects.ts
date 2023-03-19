import { assert, cloneObject } from '../../Common';
import { BattleState, BattleTurn, ChampionState } from '../Types';

export function hitChampions(state: BattleState, targets: ChampionState[]) {
  // TODO: Handle buffs
}

export function useAbility(state: BattleState, championIndex: number, abilityIndex: number): BattleTurn {
  const snapshot = cloneObject(state);
  const champion = state.championStates[championIndex];
  const ability = champion.abilityState[abilityIndex];

  if (!champion.isBoss) {
    const boss = state.championStates.find((targetState) => targetState.isBoss);
    assert(boss, 'No boss found');

    if (ability.ability.hits) {
      boss.shieldHitsRemaining = Math.max(0, (boss.shieldHitsRemaining ?? 0) - ability.ability.hits);
    }
  } else {
    champion.shieldHitsRemaining = state.args.shieldHits;
    const targets = state.championStates.filter((targetState) => !targetState.isBoss);
    hitChampions(state, targets);
    // TODO apply new debuffs to targets
    // TODO apply boss debuffs (e.g. poison, hp burn, brimstone)
  }

  return {
    championIndex,
    abilityIndex,
    state: snapshot,
  };
}
