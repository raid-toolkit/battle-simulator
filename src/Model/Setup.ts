import { SkillBonusType, Visibility } from '@raid-toolkit/webclient';
import { RTK } from '../Data';
import { AbilitySetup, ChampionSetup } from './Types';

export function lookupChampionSetup(typeId: number): ChampionSetup | undefined {
  const heroType = RTK.heroTypes[typeId];
  if (!heroType) return undefined;

  const abilities: AbilitySetup[] = [];
  const skills = heroType.skillTypeIds.map((id) => RTK.skillTypes[id]);
  for (const skill of skills) {
    if (skill.visibility !== Visibility.Visible) {
      continue;
    }

    // all effects are passive
    if (skill.effects.every((eff) => eff.group === 1)) {
      continue;
    }

    const ability: AbilitySetup = {
      index: abilities.length,
      skillTypeId: skill.typeId,
      cooldown: skill.cooldown,
    };

    if (skill.upgrades) {
      for (const upgrade of skill.upgrades) {
        if (upgrade.type === SkillBonusType.CooltimeTurn) {
          ability.cooldown -= upgrade.value;
        }
      }
    }

    abilities.push(ability);
  }

  const setup: ChampionSetup = { typeId, abilities };
  return setup;
}

export function validateSetup(setup: Readonly<ChampionSetup>): string[] {
  const errors: string[] = [];
  if (!setup.typeId) {
    errors.push('Champion selection empty');
  }
  if (!setup.speed) {
    errors.push('Speed value empty');
  }
  return errors;
}
