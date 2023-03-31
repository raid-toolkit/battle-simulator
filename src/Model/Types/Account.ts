import { TuneState } from '../AppState';
import { SavedTeamDocument } from './SavedTeam';

export interface AccountModelCommon {
  getTeam(id: string): Promise<SavedTeamDocument>;
}

export interface AccountModelLoggedOut extends AccountModelCommon {
  userId?: undefined | null;
}

export interface AccountModelLoggedIn extends AccountModelCommon {
  userId: string;
  createTeam(name: string, savedTeam: TuneState): Promise<string>;
}

export type AccountModel = AccountModelLoggedOut | AccountModelLoggedIn;
