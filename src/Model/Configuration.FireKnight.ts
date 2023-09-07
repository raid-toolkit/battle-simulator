import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { RTK } from '../Data';
import { TURN_METER_RATE } from './Constants';
import { lookupChampionSetup } from './Setup';
import { ChampionTeam, type BossSetup, type SimulatorConfigDefinition, ChampionSetup } from './Types';

const BossSetupByStage: Record<number, BossSetup> = {
  2082001: { typeId: 26576, speed: 105, shieldHits: 15 }, // spirit
  2082002: { typeId: 26566, speed: 110, shieldHits: 15 }, // void
  2082003: { typeId: 26596, speed: 115, shieldHits: 15 }, // magic
  2082004: { typeId: 26586, speed: 120, shieldHits: 15 }, // force
  2082005: { typeId: 26576, speed: 125, shieldHits: 18 }, // spirit
  2082006: { typeId: 26566, speed: 150, shieldHits: 18 }, // void
  2082007: { typeId: 26596, speed: 175, shieldHits: 18 }, // magic
  2082008: { typeId: 26586, speed: 200, shieldHits: 21 }, // force
  2082009: { typeId: 26576, speed: 225, shieldHits: 21 }, // spirit
  2082010: { typeId: 26566, speed: 250, shieldHits: 21 }, // void
} as const;

export const FireknightConfig: SimulatorConfigDefinition = {
  config: { decoration: 'shield-hits', grouping: 'boss-turn', playerHeroes: 5 },
  stages: Object.fromEntries(
    Object.entries(BossSetupByStage).map(([id, setup]) => [
      id,
      {
        setup(state, stage) {
          const { speed: bossSpeed, shieldHits } = BossSetupByStage[stage];
          // TODO: use typeid from stage
          const bossHero = lookupChampionSetup(26566)!; // FK10

          // TODO: Make boss selectable
          state.championStates.push({
            index: state.championStates.length,
            team: ChampionTeam.Enemy,
            isBoss: true,
            name: RTK.getString(RTK.heroTypes[bossHero.typeId!].name),
            speed: bossSpeed,
            turnMeter: bossSpeed * TURN_METER_RATE * 3,
            turnsTaken: 0,
            abilityState: bossHero.abilities.map((ability, index) => ({
              index,
              ability,
              cooldownRemaining: 0,
            })),
            shieldHitsRemaining: shieldHits,
            fullShieldHits: shieldHits,
            setup: {
              typeId: 26566, // FK10
              speed: bossSpeed,
              skillOpener: -1,
              abilities: bossHero.abilities,
            } as Required<ChampionSetup>,
            buffs: [],
            debuffs: [],
            immuneToEffectTypes: [
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
        },
      },
    ])
  ),
};
