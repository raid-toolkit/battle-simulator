import { SkillTargets, SkillType } from '@raid-toolkit/webclient';
import React from 'react';
import { useAppModel } from '../Model';
import { Select } from 'antd';
import { RTK } from '../Data';

export interface AbilityTargetSettingProps {
  skill: SkillType;
  skillIndex: number;
  ownerIndex: number;
}

export const AbilityTargetSetting: React.FC<AbilityTargetSettingProps> = ({ skill, skillIndex, ownerIndex }) => {
  const { state, dispatch } = useAppModel();
  const targets = React.useMemo(() => {
    switch (skill.targets) {
      case SkillTargets.AliveAllies:
      case SkillTargets.AllAllies:
      case SkillTargets.DeadAllies:
        return state.tuneState.championList;
      case SkillTargets.AliveAlliesExceptProducer:
      case SkillTargets.AllAlliesExceptProducer:
        return state.tuneState.championList.filter((_, index) => index !== ownerIndex);
      case SkillTargets.Producer:
        return [state.tuneState.championList[ownerIndex]];
      default:
        return [];
    }
  }, [skill, ownerIndex, state]);
  const options = React.useMemo(() => {
    return [{ label: 'Default', value: NaN }].concat(
      targets.map((target) => ({
        label: RTK.getString(RTK.heroTypes[target.typeId!].name),
        value: state.tuneState.championList.indexOf(target),
      }))
    );
  }, [targets, state]);

  const setup = state.tuneState.championList[ownerIndex].abilities[skillIndex];

  const onChange = React.useCallback(
    (value: number) => {
      dispatch.updateChampionSkill(ownerIndex, skillIndex, (ability) => {
        ability.targetIndex = value;
      });
    },
    [dispatch, ownerIndex, skillIndex]
  );

  if (targets.length === 0) return null;
  return (
    <div className="skill-targets">
      <span>Target </span>
      <Select
        value={setup.targetIndex}
        onChange={onChange}
        options={options}
        placeholder="Target"
        style={{ flex: 1 }}
      />
    </div>
  );
};
