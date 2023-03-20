import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import type { AbilitySetup } from './AbilitySetup';
import type { ChampionSetup } from './ChampionSetup';

export enum ChampionTeam {
  Friendly,
  Enemy,
}

export interface StatusEffect {
  typeId: StatusEffectTypeId;
  duration: number;
}

export interface SimulateTurnsArgs {
  championSetups: readonly Readonly<Required<ChampionSetup>>[];
  bossSpeed: number;
  shieldHits: number;
  speedAura?: number;

  stopAfter?: number;
}

export interface AbilityState {
  index: number;
  ability: Readonly<AbilitySetup>;
  cooldownRemaining: number;
}

export interface ChampionState {
  team: ChampionTeam;
  isBoss?: boolean;
  definesPhase?: boolean;
  shieldHitsRemaining?: number;

  index: number;
  name: string;
  setup: Readonly<Required<ChampionSetup>>;
  speed: number;
  turnMeter: number;
  turnsTaken: number;
  abilityState: AbilityState[];
  debuffs: StatusEffect[];
  buffs: StatusEffect[];
  immuneTo?: StatusEffectTypeId[];
}

export interface BattleState {
  args: SimulateTurnsArgs;
  championStates: ChampionState[];

  turnState?: TurnState;
}

export interface BattleTurn {
  championIndex: number;
  abilityIndex: number;
  state: Readonly<BattleState>;
}

export interface TurnState {
  hitsToPostProcess: number[];
  turn?: BattleTurn;
  isProcessingAllyAttack?: boolean;
  isProcessingCounterAttack?: boolean;
}
