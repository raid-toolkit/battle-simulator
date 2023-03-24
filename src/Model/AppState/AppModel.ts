import { AppState } from './AppState';

export interface AppDispatch {
  changeTheme(): void;
  changeTheme(theme: 'light' | 'dark'): void;
  setSpeedAura(speedAura: number | null): void;
}

export interface AppModel {
  state: AppState;
  dispatch: AppDispatch;
}
