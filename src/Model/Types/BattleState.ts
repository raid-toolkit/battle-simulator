import type { AbilitySetup } from './AbilitySetup';
import type { ChampionSetup } from './ChampionSetup';

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
}

export interface BattleState {
  args: SimulateTurnsArgs;
  championStates: ChampionState[];
}

export interface BattleTurn {
  championIndex: number;
  abilityIndex: number;
  state: BattleState;
}
