import { EffectKindId } from '@raid-toolkit/webclient';
import { RTK } from '../Data';
import { TURN_METER_RATE } from './Constants';
import { lookupChampionSetup } from './Setup';
import { ChampionTeam, type SimulatorConfigDefinition, ChampionSetup } from './Types';
import stageData from '../Static/stages.json';

const { stages } = stageData;

export const HydraConfig: SimulatorConfigDefinition = {
  config: { decoration: 'devour', grouping: 'slowest', playerHeroes: 6 },
  stages: Object.fromEntries(
    Object.entries(stages).map(([id, { slots }]) => [
      id,
      {
        setup(state, _stage) {
          for (const { typeId, speed } of slots) {
            const bossHero = lookupChampionSetup(typeId)!;
            const immuneToEffects = RTK.heroTypes[typeId].skillTypeIds
              .map((skillTypeId) => RTK.skillTypes[skillTypeId])
              .flatMap((skillType) => skillType.effects.filter((effect) => effect.kindId === EffectKindId.BlockEffect));
            const immuneToEffectKinds = immuneToEffects.flatMap(
              (effect) => effect.blockEffectParams?.effectKindIds ?? []
            );
            const immuneToEffectTypes = immuneToEffects.flatMap(
              (effect) => effect.blockEffectParams?.effectTypeIds ?? []
            );

            state.championStates.push({
              index: state.championStates.length,
              team: ChampionTeam.Enemy,
              isBoss: true,
              name: RTK.getString(RTK.heroTypes[typeId].name),
              speed: speed,
              turnMeter: speed * TURN_METER_RATE * 3,
              turnsTaken: 0,
              abilityState: bossHero.abilities.map((ability, index) => ({
                index,
                ability,
                cooldownRemaining: 0,
              })),
              setup: {
                typeId,
                speed,
                skillOpener: -1,
                abilities: bossHero.abilities,
              } as Required<ChampionSetup>,
              buffs: [],
              debuffs: [],
              immuneToEffectKinds,
              immuneToEffectTypes,
            });
          }
        },
      },
    ])
  ),
};
