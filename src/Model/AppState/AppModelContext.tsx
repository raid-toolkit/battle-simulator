import React from 'react';
import { useImmer } from 'use-immer';
import { assert } from '../../Common';
import { lookupChampionSetup } from '../Setup';
import { AbilitySetup, ChampionSetup } from '../Types';
import { AppModel, AppDispatch } from './AppModel';
import { AppState } from './AppState';

const AppModelContext = React.createContext<AppModel | null>(null);

function useAppModelInternal(): AppModel {
  const [state, setState] = useImmer<AppState>({
    theme: 'dark',
    saveState: {
      savedTunes: [],
      dirty: false,
    },
    tuneState: {
      boss: {
        // hardcoded for now
        speed: 250,
        typeId: 26566,
        shieldHits: 21,
      },
      speedAura: 0,
      championList: [],
    },
    turnSimulation: [],
  });

  React.useEffect(() => {
    const htmlRoot = document.querySelector('html');
    htmlRoot!.style.colorScheme = state.theme;
  }, [state.theme]);

  const dispatch = React.useMemo<AppDispatch>(
    () =>
      new (class AppDispatch implements AppDispatch {
        changeTheme(theme?: 'light' | 'dark') {
          setState((state) => {
            state.theme =
              theme && ['dark', 'light'].includes(theme) ? theme : state.theme === 'light' ? 'dark' : 'light';
          });
        }

        setSpeedAura(speedAura: number | null) {
          setState((state) => {
            state.tuneState.speedAura = speedAura || 0;
          });
        }

        temp_setChampionsList(championList: ChampionSetup[]) {
          setState((state) => {
            state.tuneState.championList = championList;
          });
        }

        addChampionDraft(): void {
          setState((state) => {
            state.tuneState.championList.push({
              abilities: [],
            });
          });
        }

        removeChampion(index: number): void {
          setState((state) => {
            state.tuneState.championList.splice(index, 1);
          });
        }

        updateChampion(index: number, update: (champion: ChampionSetup) => void): void {
          setState((state) => update(state.tuneState.championList[index]));
        }

        updateChampionSkill(index: number, skillIndex: number, update: (ability: AbilitySetup) => void): void {
          setState((state) => update(state.tuneState.championList[index].abilities[skillIndex]));
        }

        setSetupTypeId(index: number, typeId: number | undefined): void {
          setState((state) => {
            if (typeId === undefined) {
              state.tuneState.championList[index] = { abilities: [] };
            } else {
              const setup = lookupChampionSetup(typeId);
              assert(setup, 'typeId not found');
              state.tuneState.championList[index] = setup;
            }
          });
        }
      })(),
    [setState]
  );
  return React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
}

export function ProvideAppModel({ children }: { children: React.ReactNode }) {
  const appModel = useAppModelInternal();
  return <AppModelContext.Provider value={appModel}>{children}</AppModelContext.Provider>;
}

export function useAppModel(): AppModel {
  const appModel = React.useContext(AppModelContext);
  assert(appModel);
  return appModel;
}
