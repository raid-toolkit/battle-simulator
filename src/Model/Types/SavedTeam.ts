import { ChampionSetup } from './ChampionSetup';

export interface SavedTeamVersion {
  speedAura: number;
  champions: readonly Readonly<ChampionSetup>[];
}

export interface SavedTeam {
  name: string;
  versions: readonly Readonly<SavedTeamVersion>[];
}
