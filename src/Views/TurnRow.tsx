import React from 'react';
import { Tooltip } from 'antd';
import { BattleTurn, ChampionTeam } from '../Model';
import { Avatar } from '../Components';
import { RTK } from '../Data';
import { colors } from './TurnGroupCardView';
import { BattleStateView } from './BattleStateView';
import './TurnRow.css';

export const TurnRow: React.FC<{ turn: BattleTurn }> = ({ turn }) => {
  const championState = turn.state.championStates[turn.championIndex];
  const championType = RTK.heroTypes[championState.setup.typeId];
  const skillType = RTK.skillTypes[championState.setup.abilities[turn.abilityIndex].skillTypeId];
  const championName = RTK.getString(championType.name);
  const skillName = RTK.getString(skillType.name);
  return (
    <Tooltip
      placement="right"
      trigger={['click']}
      overlayInnerStyle={{ width: 422 }}
      title={() => <BattleStateView state={turn.state} turnIndex={turn.championIndex} showEffects showTurnMeter />}
    >
      <div
        className={`turn-row turn-row-${championState.team === ChampionTeam.Friendly ? 'friendly' : 'enemy'}`}
        style={{
          backgroundColor: colors[turn.championIndex * 2],
        }}
      >
        <Avatar id={RTK.heroTypes[championState.setup.typeId].avatarKey} height="2rem" style={{ marginRight: 8 }} />
        <span style={{ flex: 1 }}>
          {championName}: {skillName}
        </span>
        <span>({turn.state.championStates.find((ch) => ch.isBoss)?.shieldHitsRemaining})</span>
      </div>
    </Tooltip>
  );
};
