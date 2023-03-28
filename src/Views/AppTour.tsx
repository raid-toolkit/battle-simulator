import { Tour, TourStepProps } from 'antd';
import React from 'react';
import safeLocalStorage from '../Common/LocalStorage';
import { TourStep, useAppModel } from '../Model';

export const AppTour: React.FC = () => {
  const { state, dispatch } = useAppModel();

  const addChampionStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Add a Champion',
      description: 'Click here to add a champion to your team',
      placement: 'bottomRight',
      target: () => document.querySelector('#addChampionButton') as HTMLElement,
      onNext: () => {
        if (state.tuneState.championList.length === 0) {
          dispatch.addChampionDraft();
        }
        dispatch.setTourStep(1);
      },
    }),
    [state.tuneState.championList, dispatch]
  );

  const chooseChampionStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Select a Champion',
      description: `Click and type here to find the champion you're looking for`,
      placement: 'left',
      target: () => document.querySelector('.ability-row .ant-select-selector') as HTMLElement,
    }),
    []
  );

  const chooseSpeedStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Set your speed',
      description: `Once entering a speed, you'll see the calculator start to show the turn order.`,
      placement: 'bottomLeft',
      target: () => document.querySelector('.ability-row .ant-input-number-input') as HTMLElement,
    }),
    []
  );

  const bossTurnStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Boss turns',
      description: `Turns are grouped by when the boss takes his turn.`,
      placement: 'right',
      arrow: { pointAtCenter: true },
      target: () => document.querySelector('.boss-turn-card') as HTMLElement,
    }),
    []
  );

  const bossHitsStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Shield Hits',
      description: (
        <div>
          <p>
            Each champion which hits the boss will decrease his shield counter. Each turn shown will indicate the boss
            shield counter at the <em>start</em> of their turn.{' '}
          </p>
          <p>
            A champion's debuffs will only land if their turn <em>ends</em> with the boss shield counter at 0.
          </p>
        </div>
      ),
      placement: 'right',
      target: () => document.querySelector('.turn-row-friendly') as HTMLElement,
    }),
    []
  );

  const turnStateStep = React.useMemo<TourStepProps>(
    () => ({
      title: 'Turn State',
      description: (
        <div>
          <p>
            The final state when the boss takes his turn is displayed at the bottom of the turn group. This allows you
            see which buffs and debuffs are up at a glance.
          </p>
          <p>
            You can also click on any turn row to see the full state of the battle at the start of that turn, including
            each champions individual turn meter.
          </p>
        </div>
      ),
      placement: 'right',
      target: () => document.querySelector('.battle-state') as HTMLElement,
    }),
    []
  );

  const steps = React.useMemo<TourStepProps[]>(
    () =>
      Object.entries({
        [TourStep.AddChampion]: addChampionStep,
        [TourStep.SelectChampion]: chooseChampionStep,
        [TourStep.SetChampionSpeed]: chooseSpeedStep,
        [TourStep.BossTurn]: bossTurnStep,
        [TourStep.BossHits]: bossHitsStep,
        [TourStep.TurnState]: turnStateStep,
      })
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, step]) => step),
    [addChampionStep, chooseChampionStep, chooseSpeedStep, bossTurnStep, bossHitsStep, turnStateStep]
  );
  const isOpen = state.tourStep !== undefined && steps[state.tourStep] !== undefined;

  const closeTour = React.useCallback(() => {
    dispatch.setTourStep(undefined);
    safeLocalStorage.setItem('seen_tour', 'true');
  }, [dispatch]);

  React.useEffect(() => {
    if (safeLocalStorage.getItem('seen_tour') !== 'true') {
      dispatch.setTourStep(0);
    }
  }, [dispatch]);

  return (
    <Tour
      type="primary"
      steps={steps}
      open={isOpen}
      current={state.tourStep}
      onChange={dispatch.setTourStep}
      onClose={closeTour}
      onFinish={closeTour}
    />
  );
};
