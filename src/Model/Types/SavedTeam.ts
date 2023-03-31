import { TuneState } from '../AppState';
import { ChampionSetup } from './ChampionSetup';

/**
 * @deprecated
 */
export interface SavedTeamVersion {
  speedAura: number;
  champions: ChampionSetup[];
}

/**
 * @deprecated
 */
export interface SavedTeam {
  name: string;
  versions: SavedTeamVersion[];
}

export interface SavedTeamDocument {
  name: string;
  savedTeam: TuneState;
  created: Date;
}
