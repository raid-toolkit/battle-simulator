import { Draft } from 'immer';
import React from 'react';
import { useImmer } from 'use-immer';
import { assert, PendingResult } from '../../Common';
import { BackgroundService, TurnSimulationResponse } from '../../Service';
import { lookupChampionSetup, validateSetup } from '../Setup';
import { AbilitySetup, AreaId, BattleTurn, ChampionSetup, StatKind, TourStep } from '../Types';
import { AppModel, AppDispatch } from './AppModel';
import { AppState, CompatibleTuneState, TuneState } from './AppState';
import { isAuraApplicable, sanitizeChampionSetup, sanitizeTuneState } from './Helpers';
import { themeClassName } from '../../Styles/Variables';
import { getSerializedTeamUrl } from '../SerializedTeam';
import { BossSetupByStage } from '../StageInfo';
import { RTK } from '../../Data';

const AppModelContext = React.createContext<AppModel | null>(null);

const defaultTune: TuneState = {
  stage: 10,
  championList: [],
};

function useAppModelInternal(): AppModel {
  const [state, setState] = useImmer<AppState>({
    theme: 'dark',
    visiblePanel: 'team',
    initializedTune: false,
    saveState: {
      savedTunes: [],
      dirty: false,
    },
    tuneState: defaultTune,
    turnSimulationErrors: [],
    turnSimulation: [],
  });

  React.useEffect(() => {
    const htmlRoot = document.querySelector('html');
    htmlRoot!.style.colorScheme = state.theme;
    htmlRoot!.setAttribute('data-theme', state.theme);
    document.body.className = themeClassName;
  }, [state.theme]);

  // TODO: Do some shit with this
  const [, setError] = React.useState<unknown | undefined>(undefined);

  React.useEffect(() => {
    if (state.initializedTune) {
      const currentTeamUrl = getSerializedTeamUrl(state.tuneState);
      if (document.location.href !== currentTeamUrl) {
        window.history.replaceState(undefined, '', currentTeamUrl);
      }
    }
    const championList = state.tuneState.championList;
    const errors = new Set(championList.flatMap(validateSetup));
    if (championList.length && errors.size === 0) {
      const bossSetup = BossSetupByStage[state.tuneState.stage];
      const leaderSkill = RTK.heroTypes[championList[0].typeId!].leaderSkill;
      const speedAura =
        isAuraApplicable(leaderSkill, AreaId.dungeon) && leaderSkill.kind?.toLocaleLowerCase() === StatKind.speed
          ? leaderSkill.value * 100
          : 0;
      let request: PendingResult<TurnSimulationResponse> | undefined = BackgroundService.requestTurnSimulation({
        bossSpeed: bossSetup.speed,
        shieldHits: bossSetup.shieldHits,
        championSetups: championList as Required<ChampionSetup>[],
        speedAura,
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
  }, [state.tuneState, state.initializedTune, setState]);

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
          // setState((state) => {
          //   state.tuneState.speedAura = speedAura || 0;
          // });
        }

        importTune(tuneState: CompatibleTuneState): void {
          setState((state) => {
            state.tuneState = sanitizeTuneState(tuneState);
            state.initializedTune = true;
          });
        }

        loadDefaultTune(): void {
          setState((state) => {
            state.tuneState = defaultTune;
            state.initializedTune = true;
          });
        }

        setStage(stage: number): void {
          setState((state) => {
            state.tuneState.stage = stage;
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
