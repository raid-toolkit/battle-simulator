import React from 'react';
import { BattleTurn, ChampionSetup } from '../Model';
import { setupBattle, simulateTurns } from '../Model/SimulateTurns';
import { TurnGroupCardView } from './TurnGroupCardView';

export interface TurnSimulatorViewProps {
  championList: readonly Readonly<ChampionSetup>[];
  bossSpeed: number;
  shieldHits: number;
  speedAura?: number;
}

export const TurnSimulatorView: React.FC<TurnSimulatorViewProps> = ({
  championList,
  bossSpeed,
  shieldHits,
  speedAura,
}) => {
  const liveState = React.useMemo(() => {
    return setupBattle({
      bossSpeed,
      shieldHits,
      speedAura,
      championSetups: championList as readonly Required<ChampionSetup>[],
      stopAfter: 100,
    });
  }, [championList, bossSpeed, shieldHits, speedAura]);

  const turns = React.useMemo(() => {
    try {
      return simulateTurns(liveState);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [liveState]);

  const turnGroups = React.useMemo(() => {
    const turnGroups: BattleTurn[][] = [];
    let currentTurnGroup: BattleTurn[] = [];
    try {
      for (const turn of turns) {
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
  }, [turns]);

  const turnCards = turnGroups.map((turnGroup, index) => (
    <TurnGroupCardView key={`group_${index}`} turnSequence={index + 1} turns={turnGroup} />
  ));

  return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>{turnCards}</div>;
};
