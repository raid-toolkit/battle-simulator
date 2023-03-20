/* eslint-disable react-hooks/rules-of-hooks */
import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { assert } from '../../Common';
import { TURN_METER_RATE } from '../Constants';
import { BattleState, ChampionState, BattleTurn } from '../Types';
import { useAbility } from './TurnEffects';

const speedAdjustments: Partial<Record<StatusEffectTypeId, number>> = {
  [StatusEffectTypeId.DecreaseSpeed15]: -0.15,
  [StatusEffectTypeId.DecreaseSpeed30]: -0.3,
  [StatusEffectTypeId.IncreaseSpeed15]: 0.15,
  [StatusEffectTypeId.IncreaseSpeed30]: 0.3,
};

export function tick(state: BattleState) {
  for (const champion of state.championStates) {
    const speedAdj =
      1 +
      champion.buffs
        .concat(champion.debuffs)
        .reduce((speedAdj, effect) => speedAdj + (speedAdjustments[effect.typeId] ?? 0), 0);
    champion.turnMeter += champion.speed * TURN_METER_RATE * speedAdj;
  }
}

export function getNextTurn(state: BattleState) {
  let nextTurn: ChampionState | undefined;
  for (const champion of state.championStates) {
    if (champion.turnMeter >= 100) {
      if (!nextTurn || champion.turnMeter > nextTurn.turnMeter) {
        nextTurn = champion;
      }
    }
  }
  return nextTurn?.index ?? -1;
}

export function runToNextTurn(state: BattleState) {
  let nextTurn: number;
  while ((nextTurn = getNextTurn(state)) === -1) {
    tick(state);
  }
  return nextTurn;
}

export function takeNextTurn(state: BattleState): BattleTurn {
  const nextTurn = runToNextTurn(state);
  assert(nextTurn !== -1, 'No turn to take');
  const champion = state.championStates[nextTurn];
  const abilities = champion.abilityState.filter((ability) => ability.cooldownRemaining === 0);
  const starter = abilities.find((a) => a.ability.opener);
  if (champion.turnsTaken === 0 && starter) {
    return useAbility(state, nextTurn, starter.index);
  }
  const nextAbility = abilities.sort((a, b) => (a.ability.priority ?? 99) - (b.ability.priority ?? 99))[
    abilities.length - 1
  ];
  assert(nextAbility, 'No ability to use');
  return useAbility(state, nextTurn, nextAbility.index);
}

export function simulateTurns(state: BattleState) {
  const turns: BattleTurn[] = [];
  for (let i = 0; i < (state.args.stopAfter ?? 250); ++i) {
    const turn = takeNextTurn(state);

    const champion = state.championStates[turn.championIndex];
    const ability = champion.abilityState[turn.abilityIndex];
    for (const ability of champion.abilityState) {
      ability.cooldownRemaining = Math.max(0, ability.cooldownRemaining - 1);
    }
    ability.cooldownRemaining = ability.ability.cooldown;
    champion.turnMeter = 0;
    ++champion.turnsTaken;

    turns.push(turn);
  }
  return turns;
}
