import React from 'react';
import { Card, Tooltip } from 'antd';
import { BattleState, BattleTurn } from '../Model';
import { presetDarkPalettes } from '@ant-design/colors';
import { Avatar, TurnMeter } from '../Components';
import { RTK } from '../Data';
import { StatusEffectIcon } from './StatusEffectIcon';

const colors = Object.entries(presetDarkPalettes).map(([key, value]) => value[5]);

export interface TurnGroupCardViewProps {
  turnSequence: number;
  turns: BattleTurn[];
}

export interface BattleStateViewProps {
  state: BattleState;
  turnIndex: number;
  showEffects?: boolean;
  showTurnMeter?: boolean;
}

export interface ChampionStateViewProps {
  state: BattleState;
  index: number;
  takingTurn?: boolean;
  showEffects?: boolean;
  showTurnMeter?: boolean;
}

const EndStateView: React.FC<ChampionStateViewProps> = ({ state, index, showEffects, showTurnMeter, takingTurn }) => {
  const height = Math.max(2, 0 + (showEffects ? 2 : 0) + (showTurnMeter ? 1 : 0));
  const championState = state.championStates[index];
  return (
    <div
      style={{
        padding: '4px 8px',
        textShadow: '1px 1px 3px black, 1px 1px 1px black',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Avatar
        id={RTK.heroTypes[championState.setup.typeId].avatarKey}
        height={`${height}rem`}
        style={{ marginRight: 4 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'flex-end' }}>
        {showTurnMeter && (
          <TurnMeter showLabel value={championState.turnMeter / 100} winner={takingTurn} width="100%" height="1rem" />
        )}
        {showEffects && (
          <>
            <span>
              {championState.buffs.map((buff, idx) => (
                <StatusEffectIcon key={`buff${idx}`} height="2rem" typeId={buff.typeId} duration={buff.duration} />
              ))}
            </span>
            <span>
              {championState.debuffs.map((buff, idx) => (
                <StatusEffectIcon key={`debuff${idx}`} height="2rem" typeId={buff.typeId} duration={buff.duration} />
              ))}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const BattleStateView: React.FC<BattleStateViewProps> = ({ state, showEffects, showTurnMeter, turnIndex }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {state.championStates.map((championState, index) => (
        <EndStateView
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

export const TurnGroupCardView: React.FC<TurnGroupCardViewProps> = ({ turns, turnSequence }) => {
  return (
    <Card title={`Boss Turn #${turnSequence}`} style={{ width: 390 }} bodyStyle={{ padding: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {turns.map((turn, idx) => (
          <Tooltip
            key={`turn_${idx}`}
            placement="right"
            trigger={['click']}
            overlayInnerStyle={{ width: 422 }}
            title={() => (
              <BattleStateView state={turn.state} turnIndex={turn.championIndex} showEffects showTurnMeter />
            )}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
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
              <span style={{ verticalAlign: 'middle', flex: 1 }}>
                {turn.state.championStates[turn.championIndex].name}:{' '}
                {turn.state.championStates[turn.championIndex].abilityState[turn.abilityIndex].ability.label}
              </span>
              <span>({turn.state.championStates.find((ch) => ch.isBoss)?.shieldHitsRemaining})</span>
            </div>
          </Tooltip>
        ))}
      </div>
      <BattleStateView state={turns[turns.length - 1].state} showEffects turnIndex={-1} />
    </Card>
  );
};
