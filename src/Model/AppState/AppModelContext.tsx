import { Draft } from 'immer';
import React from 'react';
import { useImmer } from 'use-immer';
import { assert, PendingResult } from '../../Common';
import { BackgroundService, TurnSimulationResponse } from '../../Service';
import { lookupChampionSetup, validateSetup } from '../Setup';
import { AbilitySetup, BattleTurn, ChampionSetup, TourStep } from '../Types';
import { AppModel, AppDispatch } from './AppModel';
import { AppState, TuneState } from './AppState';
import { sanitizeChampionSetup, sanitizeTuneState } from './Helpers';

const AppModelContext = React.createContext<AppModel | null>(null);

function useAppModelInternal(): AppModel {
  const [state, setState] = useImmer<AppState>({
    theme: 'dark',
    visiblePanel: 'team',
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
    turnSimulationErrors: [],
    turnSimulation: [],
  });

  React.useEffect(() => {
    const htmlRoot = document.querySelector('html');
    htmlRoot!.style.colorScheme = state.theme;
    htmlRoot?.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // TODO: Do some shit with this
  const [, setError] = React.useState<unknown | undefined>(undefined);

  React.useEffect(() => {
    const championList = state.tuneState.championList;
    const errors = new Set(championList.flatMap(validateSetup));
    if (championList.length && errors.size === 0) {
      let request: PendingResult<TurnSimulationResponse> | undefined = BackgroundService.requestTurnSimulation({
        bossSpeed: state.tuneState.boss.speed,
        shieldHits: state.tuneState.boss.shieldHits,
        championSetups: championList as Required<ChampionSetup>[],
        speedAura: state.tuneState.speedAura,
        stopAfter: 75,
      });

      request
        .then((response) => {
          setState((state) => {
            state.turnSimulationErrors = [];
            state.turnSimulation = response.turns as Draft<BattleTurn>[];
          });
        })
        .catch((e) => {
          if (request) {
            setState((state) => {
              state.turnSimulationErrors = [e];
            });
            setError(e);
          }
          request = undefined;
        });

      return () => {
        request?.cancel();
        request = undefined;
      };
    } else {
      setState((state) => {
        state.turnSimulationErrors = [...errors.values()];
        state.turnSimulation = [];
      });
    }
  }, [state.tuneState, setState]);

  const dispatch = React.useMemo<AppDispatch>(
    () =>
      new (class AppDispatch implements AppDispatch {
        changeTheme(theme?: 'light' | 'dark') {
          setState((state) => {
            state.theme =
              theme && ['dark', 'light'].includes(theme) ? theme : state.theme === 'light' ? 'dark' : 'light';
          });
        }

        setSelectedPanel(panel: 'team' | 'battle'): void {
          setState((state) => {
            state.visiblePanel = panel;
          });
        }

        setHighlight(championIndex?: number, skillIndex?: number): void {
          setState((state) => {
            state.highlight = championIndex === undefined ? undefined : [championIndex, skillIndex];
          });
        }

        setSpeedAura(speedAura: number | null) {
          setState((state) => {
            state.tuneState.speedAura = speedAura || 0;
          });
        }

        importTune(tuneState: string | TuneState): void {
          setState((state) => {
            if (typeof tuneState === 'string') {
              state.tuneState = sanitizeTuneState(JSON.parse(atob(tuneState)));
            } else {
              state.tuneState = sanitizeTuneState(tuneState);
            }
          });
        }

        setTourStep(step: TourStep | undefined): void {
          setState((state) => {
            state.tourStep = step;
          });
        }

        completeTourStep(step: TourStep): void {
          setState((state) => {
            if (state.tourStep === step) {
              ++state.tourStep;
            }
          });
        }

        temp_setChampionsList(championList: ChampionSetup[]) {
          setState((state) => {
            state.tuneState.championList = championList.map(sanitizeChampionSetup);
          });
        }

        addChampionDraft(): void {
          setState((state) => {
            if (state.tuneState.championList.length >= 5) return;
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

        moveChampion(fromIndex: number, toIndex: number): void {
          setState((state) => {
            const [champion] = state.tuneState.championList.splice(fromIndex, 1);
            state.tuneState.championList.splice(toIndex, 0, champion);
          });
        }

        updateChampion(index: number, update: (champion: ChampionSetup) => void): void {
          setState((state) => update(state.tuneState.championList[index]));
        }

        updateChampionSkill(ownerIndex: number, skillIndex: number, update: (ability: AbilitySetup) => void): void {
          setState((state) => update(state.tuneState.championList[ownerIndex].abilities[skillIndex]));
        }

        toggleSkillOpener(ownerIndex: number, skillIndex: number): void {
          setState((state) => {
            const champion = state.tuneState.championList[ownerIndex];
            champion.skillOpener = champion.skillOpener === skillIndex ? -1 : skillIndex;
          });
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
