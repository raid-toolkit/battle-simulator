import { Card, List } from 'antd';
import React from 'react';
import { RTK } from '../Data';
import { BattleTurn, ChampionSetup, lookupChampionSetup } from '../Model';
import { setupBattle, simulateTurns } from '../Model/SimulateTurns';

export interface TurnSimulatorProps {
  championList: readonly Readonly<ChampionSetup>[];
  bossSpeed: number;
  shieldHits: number;
  speedAura?: number;
}

export const TurnSimulator: React.FC<TurnSimulatorProps> = ({ championList, bossSpeed, shieldHits, speedAura }) => {
  const liveState = React.useMemo(() => {
    return setupBattle({
      bossSpeed,
      shieldHits,
      speedAura,
      championSetups: championList as readonly Required<ChampionSetup>[],
      stopAfter: 250,
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
    <Card title={`Boss Turn #${index + 1}`}>
      <List>
        {turnGroup.map((turn) => (
          <List.Item>
            {liveState.championStates[turn.championIndex].name}:{' '}
            {liveState.championStates[turn.championIndex].abilityState[turn.abilityIndex].ability.label}
          </List.Item>
        ))}
      </List>
    </Card>
  ));

  return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>{turnCards}</div>;
};
