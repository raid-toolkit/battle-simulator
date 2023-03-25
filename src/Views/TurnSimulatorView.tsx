import React from 'react';
import { BattleTurn, useAppModel } from '../Model';
import { TurnGroupCardView } from './TurnGroupCardView';

export interface TurnSimulatorViewProps {}

export const TurnSimulatorView: React.FC<TurnSimulatorViewProps> = () => {
  const {
    state: { turnSimulation },
  } = useAppModel();

  const turnGroups = React.useMemo(() => {
    const turnGroups: BattleTurn[][] = [];
    let currentTurnGroup: BattleTurn[] = [];
    try {
      for (const turn of turnSimulation) {
        currentTurnGroup.push(turn);
        if (turn.state.championStates[turn.championIndex].definesPhase) {
          turnGroups.push(currentTurnGroup);
          currentTurnGroup = [];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return turnGroups;
    // last group may be incomplete
    // turnGroups.push(currentTurnGroup);
  }, [turnSimulation]);

  const turnCards = turnGroups.map((turnGroup, index) => (
    <TurnGroupCardView key={`group_${index}`} turnSequence={index + 1} turns={turnGroup} />
  ));

  return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>{turnCards}</div>;
};
