import { Visibility } from "@raid-toolkit/webclient";
import { RTK } from "../Data";
import { AbilitySetup } from "./AbilitySetup";
import { ChampionSetup } from "./ChampionSetup";

export function lookupChampionSetup(typeId: number): ChampionSetup | undefined {
  const heroType = RTK.heroTypes[typeId];
  if (!heroType) return undefined;

  const abilities: AbilitySetup[] = [];
  const skills = heroType.skillTypeIds.map((id) => RTK.skillTypes[id]);
  for (const skill of skills) {
    if (skill.visibility !== Visibility.Visible) {
      continue;
    }

    const ability: AbilitySetup = {
      index: abilities.length,
      label: RTK.getString(skill.name),
      cooldown: skill.cooldown,
    };

    abilities.push(ability);
  }

  const setup: ChampionSetup = { typeId, abilities };
  return setup;
}
