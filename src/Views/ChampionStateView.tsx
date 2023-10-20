import React from 'react';
import { BattleState, ChampionTeam, EffectSummarySetting, getVisualInfo } from '../Model';
import { Avatar, TurnMeter } from '../Components';
import { RTK } from '../Data';
import { StatusEffectIcon } from './StatusEffectIcon';
import './ChampionStateView.css';

export interface ChampionStateViewProps {
  state: BattleState;
  index: number;
  takingTurn?: boolean;
  immediateTurn?: boolean;
  effectSummarySettings?: EffectSummarySetting;
  showTurnMeter?: boolean;
}

export const ChampionStateView: React.FC<ChampionStateViewProps> = ({
  state,
  index,
  effectSummarySettings,
  showTurnMeter,
  takingTurn,
  immediateTurn,
}) => {
  const championState = state.championStates[index];
  const showEffects =
    championState.team === ChampionTeam.Enemy
      ? effectSummarySettings?.enemy !== false
      : effectSummarySettings?.ally !== false;
  const height = Math.max(2, 0 + (showEffects ? 2 : 0) + (showTurnMeter ? 1 : 0));

  if (!showEffects && !showTurnMeter) return null;

  return (
    <div className="champion-state-view">
      <Avatar
        id={getVisualInfo(RTK.heroTypes[championState.setup.typeId]).avatar}
        height={`${height}rem`}
        style={{ marginRight: 4 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'flex-end' }}>
        {showTurnMeter && (
          <TurnMeter
            showLabel
            immediate={immediateTurn}
            value={championState.turnMeter / 100}
            winner={takingTurn}
            width="100%"
            height="1rem"
          />
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
