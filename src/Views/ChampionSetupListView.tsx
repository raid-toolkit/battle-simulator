import React from 'react';
import { ChampionSetupView } from './ChampionSetupView';
import { ChampionSetup } from '../Model';
import './ChampionSetupListView.css';

export interface ChampionSetupListViewProps {
  editable?: boolean;
  items: readonly Readonly<ChampionSetup>[];
  addChampion: (champion: Readonly<ChampionSetup>) => void;
  deleteChampion: (index: number) => void;
  updateChampion: (index: number, champion: Readonly<ChampionSetup>) => void;
}

export const ChampionSetupListView: React.FC<ChampionSetupListViewProps> = ({
  editable,
  items,
  deleteChampion,
  updateChampion,
}) => {
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
      {items.map((setup, index) => (
        <ChampionSetupView
          key={`setup_${index}`}
          editable={editable}
          index={index}
          setup={setup}
          onUpdated={updateChampion}
          onDeleted={deleteChampion}
        />
      ))}
    </div>
  );
};
