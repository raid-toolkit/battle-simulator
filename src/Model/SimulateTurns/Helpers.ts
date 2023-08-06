import { SkillBonusType, SkillType } from '@raid-toolkit/webclient';

export function getSkillChanceUpgrade(skill: SkillType) {
  return (
    skill.upgrades?.reduce(
      (acc, upgrade) => acc + (upgrade.type === SkillBonusType.EffectChance ? upgrade.value : 0),
      0
    ) || 0
  );
}
