/* eslint-disable react-hooks/rules-of-hooks */
import { ArtifactSetKindId, StatusEffectTypeId } from '@raid-toolkit/webclient';
import { RTK } from '../../Data';
import { TURN_METER_RATE } from '../Constants';
import { lookupChampionSetup } from '../Setup';
import { BattleState, ChampionSetup, ChampionState, ChampionTeam, SimulateTurnsArgs, StatusEffect } from '../Types';
import { mulberry32 } from '../../Common';

export function setupBattle(args: SimulateTurnsArgs): BattleState {
  const { championSetups, bossSpeed, shieldHits, speedAura } = args;
  const championStates = championSetups.map<ChampionState>((setup, index) => {
    const baseSpeed = RTK.heroTypes[setup.typeId!].unscaledStats.Speed;
    const speed = setup.speed + baseSpeed * ((speedAura ?? 0) / 100);
    const buffs: StatusEffect[] = [];
    if (
      setup.setKinds?.includes(ArtifactSetKindId.BlockDebuff) ||
      setup.setKinds?.includes(ArtifactSetKindId.ResistanceAndBlockDebuff) ||
      setup.setKinds?.includes(ArtifactSetKindId.StoneSkinHpResDef)
    ) {
      buffs.push({ typeId: StatusEffectTypeId.BlockDebuff, duration: 3 });
    }
    return {
      index,
      setup,
      team: ChampionTeam.Friendly,
      name: RTK.getString(RTK.heroTypes[setup.typeId!].name),
      speed,
      turnMeter: speed * TURN_METER_RATE * 3,
      turnsTaken: 0,
      buffs,
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
      skillOpener: -1,
      abilities: bossSetup.abilities,
    } as Required<ChampionSetup>,
    buffs: [],
    debuffs: [],
    immuneTo: [
      StatusEffectTypeId.Stun,
      StatusEffectTypeId.Sleep,
      StatusEffectTypeId.BlockActiveSkills,
      StatusEffectTypeId.BlockPassiveSkills,
      StatusEffectTypeId.Fear1,
      StatusEffectTypeId.Fear2,
      StatusEffectTypeId.Provoke,
      StatusEffectTypeId.BlockRevive, // not really an immunity, but avoids treating it as a debuff slot
    ],
  });
  return {
    random: mulberry32(args.randomSeed),
    args,
    championStates,
    turnVariables: {},
    turnQueue: [],
  };
}
