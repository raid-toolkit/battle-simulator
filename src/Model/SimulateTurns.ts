/* eslint-disable react-hooks/rules-of-hooks */
import { assert, cloneObject } from '../Common';
import { RTK } from '../Data';
import { TURN_METER_RATE } from './Constants';
import { lookupChampionSetup } from './LookupSetup';
import { BattleState, ChampionState, SimulateTurnsArgs, BattleTurn } from './Types';

export function setupBattle(args: SimulateTurnsArgs): BattleState {
  const { championSetups, bossSpeed, shieldHits, speedAura } = args;
  const championStates = championSetups.map<ChampionState>((setup, index) => ({
    index,
    setup,
    name: RTK.getString(RTK.heroTypes[setup.typeId!].name),
    speed: setup.speed + (setup.baseSpeed * ((speedAura ?? 0) / 100) || 0),
    turnMeter: 0,
    turnsTaken: 0,
    abilityState: setup.abilities.map((ability, index) => ({
      index,
      ability,
      cooldownRemaining: 0,
    })),
  }));

  const bossSetup = lookupChampionSetup(26566)!; // FK10

  // TODO: Make boss selectable
  championStates.push({
    index: championStates.length,
    isBoss: true,
    definesPhase: true,
    name: RTK.getString(RTK.heroTypes[bossSetup.typeId!].name),
    speed: bossSpeed,
    turnMeter: 0,
    turnsTaken: 0,
    abilityState: bossSetup.abilities.map((ability, index) => ({
      index,
      ability,
      cooldownRemaining: 0,
    })),
    shieldHitsRemaining: shieldHits,
    setup: {
      typeId: 26566, // FK10
      speed: bossSpeed,
      baseSpeed: bossSpeed,
      abilities: bossSetup.abilities,
    },
  });
  return {
    args,
    championStates,
  };
}

export function tick(state: BattleState) {
  for (const champion of state.championStates) {
    champion.turnMeter += champion.speed * TURN_METER_RATE;
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

  for (const ability of champion.abilityState) {
    ability.cooldownRemaining = Math.max(0, ability.cooldownRemaining - 1);
  }
  ability.cooldownRemaining = ability.ability.cooldown;
  // TODO: apply post-ability effects like TM somewhere else?
  champion.turnMeter = 0;
  ++champion.turnsTaken;
  return {
    championIndex,
    abilityIndex,
    state: snapshot,
  };
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
    turns.push(turn);
  }
  return turns;
}
