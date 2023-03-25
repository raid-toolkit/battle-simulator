import { AbilitySetup, ChampionSetup } from '../Types';
import { AppState } from './AppState';

export interface AppDispatch {
  changeTheme(): void;
  changeTheme(theme: 'light' | 'dark'): void;
  setSpeedAura(speedAura: number | null): void;

  /** @deprecated replace with more narrow method */
  temp_setChampionsList(championList: ChampionSetup[]): void;
  addChampionDraft(): void;
  removeChampion(index: number): void;
  /** @deprecated replace with more narrow method */
  updateChampion(index: number, update: (champion: ChampionSetup) => void): void;
  setSetupTypeId(index: number, typeId: number | undefined): void;
  updateChampionSkill(index: number, skillIndex: number, update: (ability: AbilitySetup) => void): void;
}

export interface AppModel {
  state: AppState;
  dispatch: AppDispatch;
}
