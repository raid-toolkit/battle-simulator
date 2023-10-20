/* eslint-disable react-hooks/rules-of-hooks */
import { ArtifactSetKindId, StatusEffectTypeId } from '@raid-toolkit/webclient';
import { RTK } from '../../Data';
import { TURN_METER_RATE } from '../Constants';
import { BattleState, ChampionState, ChampionTeam, SimulateTurnsArgs, StatusEffect } from '../Types';
import { mulberry32 } from '../../Common';
import { StageBuilderByStage } from '../Configurations';

export function setupBattle(args: SimulateTurnsArgs): BattleState {
  const { championSetups, stageId, speedAura } = args;
  const championStates = championSetups.map<ChampionState>((setup, index) => {
    const baseSpeed = RTK.heroTypes[setup.typeId!].forms[0].unscaledStats.Speed;
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

  const state: BattleState = {
    random: args.chanceMode === 'rng' ? mulberry32(args.randomSeed) : () => 0,
    args,
    championStates,
    turnVariables: {},
    turnQueue: [],
  };

  const builder = StageBuilderByStage[stageId];
  builder.setup(state, stageId);

  return state;
}
