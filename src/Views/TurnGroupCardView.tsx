import React from 'react';
import { Card, List } from 'antd';
import { BattleState, BattleTurn } from '../Model';
import { presetDarkPalettes } from '@ant-design/colors';
import { Avatar } from '../Components';
import { RTK } from '../Data';
import { StatusEffectIcon } from './StatusEffectIcon';

const colors = Object.entries(presetDarkPalettes).map(([key, value]) => value[5]);

export interface TurnGroupCardViewProps {
  turnSequence: number;
  turns: BattleTurn[];
}

export interface BattleStateViewProps {
  state: BattleState;
}

const BattleStateView: React.FC<BattleStateViewProps> = ({ state }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {state.championStates.map((championState) => (
        <div
          style={{
            padding: '4px 8px',
            textShadow: '1px 1px 3px black, 1px 1px 1px black',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Avatar id={RTK.heroTypes[championState.setup.typeId].avatarKey} height="2rem" style={{ marginRight: 4 }} />
          <span style={{ verticalAlign: 'middle' }}>
            {championState.buffs.map((buff) => (
              <StatusEffectIcon height="1.5rem" typeId={buff.typeId} />
            ))}
          </span>
          <span style={{ verticalAlign: 'middle' }}>
            {championState.debuffs.map((buff) => (
              <StatusEffectIcon height="1.5rem" typeId={buff.typeId} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};

export const TurnGroupCardView: React.FC<TurnGroupCardViewProps> = ({ turns, turnSequence }) => {
  return (
    <Card title={`Boss Turn #${turnSequence}`} style={{ width: 320 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {turns.map((turn) => (
          <div
            style={{
              height: '2rem',
              backgroundColor: colors[turn.championIndex * 2],
              textShadow: '1px 1px 3px black, 1px 1px 1px black',
            }}
          >
            <Avatar
              id={RTK.heroTypes[turn.state.championStates[turn.championIndex].setup.typeId].avatarKey}
              height="2rem"
              style={{ marginRight: 4 }}
            />
            <span style={{ verticalAlign: 'middle' }}>
              {turn.state.championStates[turn.championIndex].name}:{' '}
              {turn.state.championStates[turn.championIndex].abilityState[turn.abilityIndex].ability.label}
            </span>
          </div>
        ))}
      </div>
      <BattleStateView state={turns[turns.length - 1].state} />
    </Card>
  );
};
