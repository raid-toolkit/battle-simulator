import { Select, SelectProps } from 'antd';
import React from 'react';
import { BossSetup, BossSetupByStage, useAppModel } from '../Model';

export interface BossStageItemProps {
  readonly value: number;
  readonly bossSetup: BossSetup;
  readonly label: JSX.Element | string;
  readonly children: JSX.Element | string;
}

const options = Object.entries(BossSetupByStage).map<BossStageItemProps>(([key, bossSetup]) => {
  const value = parseInt(key, 10);
  return {
    bossSetup,
    value,
    label: `Stage ${value}`,
    get children() {
      return this.label;
    },
  };
});

export const StageSelectionView: React.FC<
  Omit<SelectProps<number, BossStageItemProps>, 'options' | 'onChange' | 'value'>
> = (props) => {
  const { state, dispatch } = useAppModel();
  return <Select options={options} onChange={dispatch.setStage} value={state.tuneState.stage} {...props} />;
};
