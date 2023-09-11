import React from 'react';
import { Card } from 'antd';
import { BattleTurn, useAppModel } from '../Model';
import { TurnRow } from './TurnRow';
import { BattleStateView } from './BattleStateView';

export interface TurnGroupCardViewProps {
  turnSequence: number;
  turns: BattleTurn[];
}

export const TurnGroupCardView: React.FC<TurnGroupCardViewProps> = ({ turns, turnSequence }) => {
  const { state } = useAppModel();
  return (
    <Card
      className="boss-turn-card"
      title={`Boss Turn #${turnSequence}`}
      style={{ width: 390 }}
      bodyStyle={{ padding: 8 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {turns.map((turn, idx) => (
          <TurnRow key={`turn_${idx}`} turn={turn} />
        ))}
      </div>
      <BattleStateView
        state={turns[turns.length - 1].state}
        effectSummarySettings={state.effectSummarySettings}
        turnIndex={-1}
      />
    </Card>
  );
};
