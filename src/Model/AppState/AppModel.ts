import { AbilitySetup, ChampionSetup, TourStep } from '../Types';
import { AppState, TuneState } from './AppState';

export interface AppDispatch {
  changeTheme(): void;
  changeTheme(theme: 'light' | 'dark'): void;
  setBossTurnLimit(turnLimit: number): void;
  setTurnLimit(turnLimit: number): void;

  setSelectedPanel(panel: 'team' | 'battle'): void;
  setInfoDialogTab(tab: 'about' | 'changelog' | 'acknowledgements' | undefined): void;
  setSettingsVisible(visible: boolean): void;

  setHighlight(): void;
  setHighlight(championIndex: number, skillIndex?: number): void;

  setTourStep(step: TourStep | undefined): void;
  completeTourStep(step: TourStep): void;

  setSpeedAura(speedAura: number | null): void;
  importTune(tuneState: TuneState): void;
  loadDefaultTune(): void;
  setStage(stage: number): void;
  /** @deprecated replace with more narrow method */
  temp_setChampionsList(championList: ChampionSetup[]): void;
  addChampionDraft(): void;
  removeChampion(index: number): void;
  moveChampion(fromIndex: number, toIndex: number): void;
  /** @deprecated replace with more narrow method */
  updateChampion(index: number, update: (champion: ChampionSetup) => void): void;
  setSetupTypeId(index: number, typeId: number | undefined): void;
  updateChampionSkill(index: number, skillIndex: number, update: (ability: AbilitySetup) => void): void;
  toggleSkillOpener(index: number, skillIndex: number): void;
}

export interface AppModel {
  state: AppState;
  dispatch: AppDispatch;
}
