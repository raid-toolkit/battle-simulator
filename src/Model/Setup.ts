import { Visibility } from '@raid-toolkit/webclient';
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

    const hits = skill.effects.reduce((acc, effect) => acc + (effect.kindId === 6000 ? effect.count : 0), 0);

    const ability: AbilitySetup = {
      index: abilities.length,
      skillTypeId: skill.typeId,
      label: RTK.getString(skill.name),
      cooldown: skill.cooldown,
      hits,
      description: RTK.getString(skill.description),
    };

    abilities.push(ability);
  }

  const setup: ChampionSetup = { typeId, abilities, baseSpeed: heroType.unscaledStats.Speed };
  return setup;
}

export function validateSetup(setup: Readonly<ChampionSetup>): string[] {
  const errors: string[] = [];
  if (!setup.typeId) {
    errors.push('Champion is required');
  }
  if (!setup.speed) {
    errors.push('Speed is required');
  }
  if (setup.abilities.length === 0) {
    errors.push('At least one ability is required');
  }
  return errors;
}
