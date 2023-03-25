import React from 'react';
import { ChampionSetupView } from './ChampionSetupView';
import { useAppModel } from '../Model';
import './ChampionSetupListView.css';

export interface ChampionSetupListViewProps {}

export const ChampionSetupListView: React.FC<ChampionSetupListViewProps> = () => {
  const { state } = useAppModel();
  return (
    <div
      className="champion-setup-list"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingLeft: 40,
        marginLeft: -40,
      }}
    >
      {state.tuneState.championList.map((_setup, index) => (
        <ChampionSetupView key={`setup_${index}`} index={index} />
      ))}
    </div>
  );
};
