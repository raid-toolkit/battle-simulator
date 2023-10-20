import React from 'react';
import { BattleState, EffectSummarySetting } from '../Model';
import { ChampionStateView } from './ChampionStateView';

export interface BattleStateViewProps {
  state: BattleState;
  turnIndex: number;
  effectSummarySettings?: EffectSummarySetting;
  showTurnMeter?: boolean;
}

export const BattleStateView: React.FC<BattleStateViewProps> = ({
  state,
  effectSummarySettings,
  showTurnMeter,
  turnIndex,
}) => {
  return (
    <div className="battle-state" style={{ display: 'flex', flexDirection: 'column' }}>
      {state.championStates.map((championState, index) => (
        <ChampionStateView
          key={`endstate_${index}`}
          state={state}
          index={championState.index}
          takingTurn={championState.index === turnIndex}
          immediateTurn={championState.takeImmediateTurn}
          effectSummarySettings={effectSummarySettings}
          showTurnMeter={showTurnMeter}
        />
      ))}
    </div>
  );
};
