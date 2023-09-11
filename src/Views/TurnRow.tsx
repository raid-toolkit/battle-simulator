import React from 'react';
import { Tooltip } from 'antd';
import { CompressOutlined } from '@ant-design/icons';
import isMobile from 'is-mobile';
import { BattleTurn, ChampionTeam, EffectSummarySetting, getConfig, useAppModel } from '../Model';
import { Avatar } from '../Components';
import { RTK } from '../Data';
import { useColor } from './Colors';
import { BattleStateView } from './BattleStateView';
import './TurnRow.css';

const showEffects: EffectSummarySetting = {
  ally: true,
  enemy: true,
};

export const TurnRow: React.FC<{ turn: BattleTurn }> = ({ turn }) => {
  const { state } = useAppModel();
  const config = getConfig(state);
  const championState = turn.state.championStates[turn.championIndex];
  const championType = RTK.heroTypes[championState.setup.typeId];
  const skillType = RTK.skillTypes[championState.setup.abilities[turn.abilityIndex].skillTypeId];
  const championName = RTK.getString(championType.name);
  const skillName = RTK.getString(skillType.name);
  const hitsRemaining = turn.state.championStates.find((ch) => ch.isBoss)?.shieldHitsRemaining;
  const shouldHighlight =
    state.highlight && state.highlight[0] === turn.championIndex && state.highlight[1] === turn.abilityIndex;
  const friendly = championState.team === ChampionTeam.Friendly;
  const color = useColor(turn.championIndex, friendly ? 'friendly' : 'enemy');

  if (turn.isInfinite) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(128,128,128,0.2)',
          textAlign: 'center',
        }}
      >
        ♾️
      </div>
    );
  }
  return (
    <Tooltip
      placement={isMobile() ? 'bottom' : 'right'}
      trigger={['click']}
      overlayInnerStyle={{ width: 422, zoom: isMobile() ? 0.8 : undefined }}
      title={() => (
        <BattleStateView
          state={turn.state}
          turnIndex={turn.championIndex}
          effectSummarySettings={showEffects}
          showTurnMeter
        />
      )}
    >
      <div
        className={`turn-row turn-row-${friendly ? 'friendly' : 'enemy'} ${
          shouldHighlight ? 'turn-row-highlight' : ''
        }`}
        style={{
          backgroundColor: color,
        }}
      >
        <Avatar id={RTK.heroTypes[championState.setup.typeId].avatarKey} height="2rem" style={{ marginRight: 8 }} />
        <span style={{ flex: 1 }}>
          {championName}: {skillName}
        </span>
        {config?.decoration === 'shield-hits' ? (
          <>
            <span style={{ marginRight: 4 }}>{hitsRemaining}</span>
            <CompressOutlined />
          </>
        ) : null}
      </div>
    </Tooltip>
  );
};
