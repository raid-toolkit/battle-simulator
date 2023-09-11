import { EffectKindId, StatusEffectTypeId } from '@raid-toolkit/webclient';
import type { AbilitySetup } from './AbilitySetup';
import type { ChampionSetup } from './ChampionSetup';
import { ExpressionVars } from './RSL';
import { SimulatorConfig } from './SimulatorConfig';

export enum ChampionTeam {
  Friendly,
  Enemy,
}

export interface StatusEffect {
  typeId: StatusEffectTypeId;
  duration: number;
}

export interface SimulateTurnsArgs {
  stageId: number;
  championSetups: readonly Readonly<Required<ChampionSetup>>[];
  speedAura?: number;
  randomSeed: number;
  chanceMode: 'rng' | 'guaranteed';
  config: SimulatorConfig | undefined;

  turnLimit?: number;
  groupLimit?: number;
}

export interface AbilityState {
  index: number;
  ability: Readonly<AbilitySetup>;
  cooldownRemaining: number;
}

export interface ChampionState {
  team: ChampionTeam;
  isBoss?: boolean;
  shieldHitsRemaining?: number;
  fullShieldHits?: number;
  phantomTouchCooldown?: number;

  index: number;
  name: string;
  setup: Readonly<Required<ChampionSetup>>;
  speed: number;
  turnMeter: number;
  turnsTaken: number;
  abilityState: AbilityState[];
  debuffs: StatusEffect[];
  buffs: StatusEffect[];
  immuneToEffectKinds?: EffectKindId[];
  immuneToEffectTypes?: StatusEffectTypeId[];
}

export interface BattleState {
  random: () => number;
  args: SimulateTurnsArgs;
  championStates: ChampionState[];
  turnQueue: number[];

  currentTurnOwner?: number;
  turnVariables: ExpressionVars;
  turnState?: TurnState;
}

export interface BattleTurn {
  groupIndex: number;
  bossTurnCount: number;
  championIndex: number;
  abilityIndex: number;
  state: Readonly<BattleState>;
  isInfinite?: boolean;
}

export interface TurnState {
  hitsToPostProcess: number[];
  turn?: BattleTurn;
  isProcessingAllyAttack?: boolean;
  isProcessingCounterAttack?: boolean;
  abilityVariables: ExpressionVars;
  effectTargets: Record<number, number[]>;
}
