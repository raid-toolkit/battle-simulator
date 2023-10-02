import { BattleState } from './BattleState';

export interface SimulatorConfig {
  playerHeroes: number;
  decoration: 'shield-hits' | 'turn';
  grouping: 'boss-turn' | 'slowest' | 'none';
}

export interface StageBuilder {
  setup(state: BattleState, stageId: number): void;
}

export interface SimulatorConfigDefinition {
  config: SimulatorConfig;
  stages: Record<number, StageBuilder>;
}
