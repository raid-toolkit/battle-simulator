import { ChampionSetup } from "./ChampionSetup";

export interface SavedTeamVersion {
  champions: readonly Readonly<ChampionSetup>[];
}

export interface SavedTeam {
  name: string;
  versions: readonly Readonly<SavedTeamVersion>[];
}
