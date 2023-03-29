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
  boss: BossSetup;
  speedAura: number;
  championList: ChampionSetup[];
}

export interface AppState {
  theme: 'light' | 'dark';
  visiblePanel: 'team' | 'battle';
  highlight?: [championIndex: number, skillIndex?: number];
  tourStep?: TourStep;
  saveState: SaveState;
  tuneState: TuneState;
  turnSimulationErrors: (string | Error)[];
  turnSimulation: BattleTurn[];
}
