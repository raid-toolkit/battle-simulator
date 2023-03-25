import React from 'react';
import { theme } from 'antd';
import { AbilitySetupView } from './AbilitySetupView';
import { useAppModel } from '../Model';

export interface AbilitiyListProps {
  editable?: boolean;
  ownerIndex: number;
}

export const AbilitySetupListView: React.FC<AbilitiyListProps> = ({ ownerIndex, editable }) => {
  const { token } = theme.useToken();
  const { state } = useAppModel();
  const abilities = state.tuneState.championList[ownerIndex].abilities;

  return (
    <>
      {abilities.map((ability, index) => (
        <AbilitySetupView
          editable={editable}
          key={`ability_${index}`}
          ownerIndex={ownerIndex}
          abilityIndex={index}
          skillTypeId={ability.skillTypeId}
        />
      ))}
      {abilities.length === 0 && (
        <div
          style={{
            margin: 16,
            textAlign: 'center',
            color: token.colorTextDisabled,
          }}
        >
          Select a champion to see their abilities
        </div>
      )}
    </>
  );
};
