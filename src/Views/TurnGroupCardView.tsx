import React from 'react';
import { Card } from 'antd';
import { BattleTurn } from '../Model';
import { presetDarkPalettes } from '@ant-design/colors';
import { TurnRow } from './TurnRow';
import { BattleStateView } from './BattleStateView';

export const colors = Object.entries(presetDarkPalettes).map(([key, value]) => value[5]);

export interface TurnGroupCardViewProps {
  turnSequence: number;
  turns: BattleTurn[];
}

export const TurnGroupCardView: React.FC<TurnGroupCardViewProps> = ({ turns, turnSequence }) => {
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
      <BattleStateView state={turns[turns.length - 1].state} showEffects turnIndex={-1} />
    </Card>
  );
};
