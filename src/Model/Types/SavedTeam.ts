import { ChampionSetup } from './ChampionSetup';

export interface SavedTeamVersion {
  speedAura: number;
  champions: ChampionSetup[];
}

export interface SavedTeam {
  name: string;
  versions: SavedTeamVersion[];
}
