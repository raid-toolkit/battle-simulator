import { Cascader, CascaderProps } from 'antd';
import React from 'react';
import { useAppModel } from '../Model';
import { StageLookup } from '../Model/Configurations';

export interface BossStageItemProps {
  readonly value: string | number;
  readonly label: JSX.Element | string;
  readonly display?: JSX.Element | string;
  readonly children?: BossStageItemProps[];
}

const options: BossStageItemProps[] = [
  {
    value: 'dungeons',
    label: 'Dungeons',
    children: [
      {
        value: 'fireknight',
        label: 'Fire Knight Hard',
        children: StageLookup.filter((stage) => stage.area === 'dungeons' && stage.region === 'fireknight').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
    ],
  },
  {
    value: 'hydra',
    label: 'Hydra',
    children: [
      {
        value: 'rotation1',
        label: 'Rotation #1',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation1').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
      {
        value: 'rotation2',
        label: 'Rotation #2',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation2').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
      {
        value: 'rotation3',
        label: 'Rotation #3',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation3').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
      {
        value: 'rotation4',
        label: 'Rotation #4',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation4').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
      {
        value: 'rotation5',
        label: 'Rotation #5',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation5').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
      {
        value: 'rotation6',
        label: 'Rotation #6',
        children: StageLookup.filter((stage) => stage.area === 'hydra' && stage.region === 'rotation6').map(
          ({ stage, label }) => ({
            value: stage,
            label: label,
          })
        ),
      },
    ],
  },
];

export const StageSelectionView: React.FC<CascaderProps<BossStageItemProps>> = ({
  options: _1,
  onChange: _2,
  value: _3,
  ...props
}) => {
  const { state, dispatch } = useAppModel();
  const setStage = React.useCallback(
    (value: any) => {
      dispatch.setStage(value as [string?, string?, number?]);
    },
    [dispatch]
  );
  const value = React.useMemo(
    () => [state.area, state.region, state.tuneState.stage] as (string | number)[],
    [state.area, state.region, state.tuneState.stage]
  );
  return <Cascader options={options} multiple={false} onChange={setStage} value={value} {...props} />;
};
