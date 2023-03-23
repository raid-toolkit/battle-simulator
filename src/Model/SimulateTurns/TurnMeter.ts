/* eslint-disable react-hooks/rules-of-hooks */
import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { assert, cloneObject } from '../../Common';
import { TURN_METER_RATE } from '../Constants';
import { BattleState, ChampionState, BattleTurn } from '../Types';
import { useAbility } from './ProcessAbility';
import { processValkyrieBuff } from './ValkyrieHack';

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
  for (const ability of champion.abilityState) {
    ability.cooldownRemaining = Math.max(0, ability.cooldownRemaining - 1);
  }
  const abilities = champion.abilityState.filter(
    (ability) => ability.cooldownRemaining === 0 && ability.ability.priority !== -1
  );
  const starter = abilities.find((a) => a.ability.opener);
  if (champion.turnsTaken === 0 && starter) {
    return { state: cloneObject(state), championIndex: nextTurn, abilityIndex: starter.index };
  }
  const nextAbility = abilities.sort((a, b) => (b.ability.priority ?? 99) - (a.ability.priority ?? 99))[
    abilities.length - 1
  ];
  assert(nextAbility, 'No ability to use');
  return { state: cloneObject(state), championIndex: nextTurn, abilityIndex: nextAbility.index };
}

export function simulateTurns(state: BattleState) {
  const turns: BattleTurn[] = [];
  processValkyrieBuff(state);
  for (let i = 0; i < (state.args.stopAfter ?? 250); ++i) {
    const turn = takeNextTurn(state);
    useAbility(state, turn);

    const champion = state.championStates[turn.championIndex];
    const ability = champion.abilityState[turn.abilityIndex];

    // please punish me for this
    champion.buffs = champion.buffs.filter((buff) => (buff.duration -= 1) > 0);
    champion.debuffs = champion.debuffs.filter((buff) => (buff.duration -= 1) > 0);
    ability.cooldownRemaining = ability.ability.cooldown;
    champion.turnMeter = 0;
    ++champion.turnsTaken;

    turns.push(turn);
  }
  return turns;
}
