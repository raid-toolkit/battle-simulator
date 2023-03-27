import React from 'react';
import { BattleState } from '../Model';
import { Avatar, TurnMeter } from '../Components';
import { RTK } from '../Data';
import { StatusEffectIcon } from './StatusEffectIcon';
import './ChampionStateView.css';

export interface ChampionStateViewProps {
  state: BattleState;
  index: number;
  takingTurn?: boolean;
  showEffects?: boolean;
  showTurnMeter?: boolean;
}

export const ChampionStateView: React.FC<ChampionStateViewProps> = ({
  state,
  index,
  showEffects,
  showTurnMeter,
  takingTurn,
}) => {
  const height = Math.max(2, 0 + (showEffects ? 2 : 0) + (showTurnMeter ? 1 : 0));
  const championState = state.championStates[index];
  return (
    <div className="champion-state-view">
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
