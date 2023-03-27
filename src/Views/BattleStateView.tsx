import React from 'react';
import { BattleState } from '../Model';
import { ChampionStateView } from './ChampionStateView';

export interface BattleStateViewProps {
  state: BattleState;
  turnIndex: number;
  showEffects?: boolean;
  showTurnMeter?: boolean;
}

export const BattleStateView: React.FC<BattleStateViewProps> = ({ state, showEffects, showTurnMeter, turnIndex }) => {
  return (
    <div className="battle-state" style={{ display: 'flex', flexDirection: 'column' }}>
      {state.championStates.map((championState, index) => (
        <ChampionStateView
          key={`endstate_${index}`}
          state={state}
          index={championState.index}
          takingTurn={championState.index === turnIndex}
          showEffects={showEffects}
          showTurnMeter={showTurnMeter}
        />
      ))}
    </div>
  );
};
