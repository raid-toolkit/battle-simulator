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

    const hits = skill.effects.reduce((acc, effect) => acc + (effect.kindId === 6000 ? effect.count : 0), 0);

    const ability: AbilitySetup = {
      index: abilities.length,
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
