import React from 'react';
import { ChampionSetupView } from './ChampionSetupView';
import { useAppModel } from '../Model';
import './ChampionSetupListView.css';

export interface ChampionSetupListViewProps {}

export const ChampionSetupListView: React.FC<ChampionSetupListViewProps> = () => {
  const { state } = useAppModel();
  return (
    <div className="champion-setup-list">
      {state.tuneState.championList.map((_setup, index) => (
        <ChampionSetupView key={`setup_${index}`} index={index} />
      ))}
    </div>
  );
};
