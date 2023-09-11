/* eslint-disable react-hooks/rules-of-hooks */
import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { assert, cloneObject } from '../../Common';
import { TURN_METER_RATE } from '../Constants';
import { BattleState, ChampionState, BattleTurn, ChampionTeam } from '../Types';
import { processAbility } from './ProcessAbility';
import { processValkyrieBuff } from './ValkyrieHack';

const speedAdjustments: Partial<Record<StatusEffectTypeId, number>> = {
  [StatusEffectTypeId.DecreaseSpeed15]: -0.15,
  [StatusEffectTypeId.DecreaseSpeed30]: -0.3,
  [StatusEffectTypeId.IncreaseSpeed15]: 0.15,
  [StatusEffectTypeId.IncreaseSpeed30]: 0.3,
};

export function tickState(state: BattleState) {
  for (const champion of state.championStates) {
    tickChampion(champion);
  }
}

function tickChampion(champion: ChampionState) {
  const speedAdj =
    1 +
    champion.buffs
      .concat(champion.debuffs)
      .reduce((speedAdj, effect) => speedAdj + (speedAdjustments[effect.typeId] ?? 0), 0);
  champion.turnMeter += champion.speed * TURN_METER_RATE * speedAdj;
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
  do {
    tickState(state);
  } while ((nextTurn = getNextTurn(state)) === -1);
  return nextTurn;
}

export function selectAbility(state: BattleState, championIndex: number): number {
  const champion = state.championStates[championIndex];
  for (const ability of champion.abilityState) {
    ability.cooldownRemaining = Math.max(0, ability.cooldownRemaining - 1);
  }
  const starter = champion.setup.skillOpener !== undefined && champion.abilityState[champion.setup.skillOpener];
  if (champion.turnsTaken === 0 && starter) {
    return starter.index;
  }
  const abilities = champion.abilityState.filter(
    (ability) => ability.cooldownRemaining === 0 && ability.ability.priority !== -1
  );
  const nextAbility = abilities.sort((a, b) => (b.ability.priority ?? 99) - (a.ability.priority ?? 99))[
    abilities.length - 1
  ];
  assert(nextAbility, 'No ability to use');
  return nextAbility.index;
}

export function simulateTurns(state: BattleState) {
  const turns: BattleTurn[] = [];
  processValkyrieBuff(state);
  const turnLimit = state.args.turnLimit ?? 250,
    groupLimit = state.args.groupLimit ?? 10;
  let turnCount = 0,
    groupCount = 0,
    bossTurnCount = 0;

  const slowestAllyIndex = state.championStates.indexOf(
    state.championStates
      .filter((state) => state.team === ChampionTeam.Friendly)
      .sort((a, b) => (a.speed ?? 0) - (b.speed ?? 0))[0]
  );

  for (; turnCount < turnLimit && groupCount < groupLimit; ++turnCount) {
    const nextTurn = runToNextTurn(state);
    assert(nextTurn !== -1, 'No turn to take');
    state.turnQueue.push(nextTurn);

    let championIndex: number | undefined;
    while ((championIndex = state.turnQueue.pop()) !== undefined) {
      state.turnVariables = {};
      state.currentTurnOwner = championIndex;
      const abilityIndex = selectAbility(state, championIndex);
      const turn: BattleTurn = {
        bossTurnCount,
        groupIndex: groupCount,
        state: cloneObject(state),
        championIndex,
        abilityIndex,
      };

      const champion = state.championStates[championIndex];
      const ability = champion.abilityState[abilityIndex];
      champion.phantomTouchCooldown = 0;

      // please punish me for this
      champion.buffs = champion.buffs.filter((buff) => (buff.duration -= 1) > 0);
      champion.debuffs = champion.debuffs.filter((buff) => (buff.duration -= 1) > 0);
      champion.turnMeter = 0; //champion.speed * TURN_METER_RATE;

      processAbility(state, turn);

      ability.cooldownRemaining = ability.ability.cooldown;
      ++champion.turnsTaken;
      turns.push(turn);
    }

    if (turnCount >= turnLimit) {
      turns.push({
        groupIndex: groupCount,
        abilityIndex: -1,
        championIndex: -1,
        bossTurnCount: bossTurnCount,
        state: cloneObject(state),
        isInfinite: true,
      });
      break;
    }

    // after boss turn, start next boss turn
    if (state.championStates[nextTurn].isBoss) {
      bossTurnCount++;
      if (state.args.config?.grouping === 'boss-turn') {
        groupCount++;
        turnCount = 0;
      }
    }
    if (nextTurn === slowestAllyIndex && state.args.config?.grouping === 'slowest') {
      groupCount++;
      turnCount = 0;
    }
  }
  return turns;
}
