/* eslint-disable react-hooks/rules-of-hooks */
import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { RTK } from '../../Data';
import { TURN_METER_RATE } from '../Constants';
import { lookupChampionSetup } from '../Setup';
import { BattleState, ChampionState, ChampionTeam, SimulateTurnsArgs } from '../Types';

export function setupBattle(args: SimulateTurnsArgs): BattleState {
  const { championSetups, bossSpeed, shieldHits, speedAura } = args;
  const championStates = championSetups.map<ChampionState>((setup, index) => {
    const speed = setup.speed + setup.baseSpeed * ((speedAura ?? 0) / 100);
    return {
      index,
      setup,
      team: ChampionTeam.Friendly,
      name: RTK.getString(RTK.heroTypes[setup.typeId!].name),
      speed,
      turnMeter: speed * TURN_METER_RATE * 3,
      turnsTaken: 0,
      buffs: [],
      debuffs: [],
      abilityState: setup.abilities.map((ability, index) => ({
        index,
        ability,
        cooldownRemaining: 0,
      })),
    };
  });

  const bossSetup = lookupChampionSetup(26566)!; // FK10

  // TODO: Make boss selectable
  championStates.push({
    index: championStates.length,
    team: ChampionTeam.Enemy,
    isBoss: true,
    definesPhase: true,
    name: RTK.getString(RTK.heroTypes[bossSetup.typeId!].name),
    speed: bossSpeed,
    turnMeter: bossSpeed * TURN_METER_RATE * 3,
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
    buffs: [],
    debuffs: [],
    immuneTo: [
      StatusEffectTypeId.Stun,
      StatusEffectTypeId.Sleep,
      StatusEffectTypeId.BlockActiveSkills,
      StatusEffectTypeId.BlockPassiveSkills,
      StatusEffectTypeId.Fear1,
      StatusEffectTypeId.Fear2,
      StatusEffectTypeId.Freeze,
      StatusEffectTypeId.Provoke,
      StatusEffectTypeId.BlockRevive, // not really an immunity, but avoids treating it as a debuff slot
    ],
  });
  return {
    args,
    championStates,
  };
}
