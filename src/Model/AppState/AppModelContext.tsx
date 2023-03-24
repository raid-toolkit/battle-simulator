import React from 'react';
import { useImmer } from 'use-immer';
import { assert } from '../../Common';
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
      new (class AppDispatch {
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
