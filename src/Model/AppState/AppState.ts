import { BattleTurn, ChampionSetup, TourStep } from '../Types';

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

export interface BossSetup {
  typeId: number;
  speed: number;
  shieldHits: number;
}

export interface TuneState {
  stage: number;
  championList: ChampionSetup[];
}

export interface CompatibleTuneState {
  /** @deprecated */
  boss?: BossSetup;
  stage?: number;
  /** @deprecated */
  speedAura?: number;
  championList: ChampionSetup[];
}

export interface AppState {
  theme: 'light' | 'dark';
  visiblePanel: 'team' | 'battle';
  highlight?: [championIndex: number, skillIndex?: number];
  initializedTune: boolean;
  tourStep?: TourStep;
  saveState: SaveState;
  tuneState: TuneState;
  turnSimulationErrors: (string | Error)[];
  turnSimulation: BattleTurn[];
}
