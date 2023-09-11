import type { BattleTurn, BossSetup, ChampionSetup, TourStep } from '../Types';

export interface SavedTune {
  saveKey: string;
  displayName: string;
  versions: TuneState[];
}

export interface SaveState {
  savedTunes: SavedTune[];
  saveKey?: string;
  dirty: boolean;
}

export interface TuneState {
  stage: number | undefined;
  championList: ChampionSetup[];
  randomSeed: number;
  chanceMode: 'rng' | 'guaranteed';
}

export interface CompatibleTuneState {
  /** @deprecated */
  boss?: BossSetup;
  stage?: number;
  /** @deprecated */
  speedAura?: number;
  championList: ChampionSetup[];
  randomSeed: number;
  chanceMode: 'rng' | 'guaranteed';
}

export interface EffectSummarySetting {
  enemy?: boolean;
  ally?: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  groupLimit: number;
  turnLimit: number;
  effectSummarySettings: EffectSummarySetting;

  area?: string;
  region?: string;

  infoDialogTab: 'about' | 'changelog' | 'acknowledgements' | undefined;
  visiblePanel: 'team' | 'battle';
  settingsVisible: boolean;

  highlight?: [championIndex: number, skillIndex?: number];
  initializedTune: boolean;

  turnWorkerState: 'idle' | 'running';
  turnWorkerDuration: number;

  tourStep?: TourStep;
  saveState: SaveState;
  tuneState: TuneState;
  turnSimulationErrors: (string | Error)[];
  turnSimulation: BattleTurn[];
}
