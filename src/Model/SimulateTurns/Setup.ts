/* eslint-disable react-hooks/rules-of-hooks */
import { RTK } from '../../Data';
import { lookupChampionSetup } from '../Setup';
import { BattleState, ChampionState, SimulateTurnsArgs } from '../Types';

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
