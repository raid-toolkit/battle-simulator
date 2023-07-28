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
  bossTurnLimit: number;
  turnLimit: number;

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
