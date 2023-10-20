/* eslint-disable react-hooks/rules-of-hooks */
import { EffectTargetType, EffectType, SkillTargets, SkillType, TargetExclusion } from '@raid-toolkit/webclient';
import { shuffle } from '../../Common';
import { AbilityState, BattleState, ChampionState, TurnState } from '../Types';
import { RTK } from '../../Data';

function skillTargetsAlly(skill: SkillType) {
  if (skill.targets === undefined) return false;
  switch (skill.targets) {
    case SkillTargets.AliveAllies:
    case SkillTargets.AllAllies:
    case SkillTargets.AliveAlliesExceptProducer:
    case SkillTargets.AllAlliesExceptProducer:
    case SkillTargets.DeadAllies:
      return true;
    default:
      return false;
  }
}

function selectTargetChampions(
  state: Readonly<BattleState>,
  ownerIndex: number,
  effectType: EffectType,
  turnState: TurnState,
  ability: AbilityState
): ChampionState[] {
  const skill = RTK.skillTypes[ability.ability.skillTypeId];
  const owner = state.championStates[ownerIndex];
  const ownerTeam = owner.team;
  if (!effectType.targetParams) {
    console.warn('Unexpected missing targetParams', { effectType });
    return [];
  }
  const targetType = effectType.targetParams.targetType;
  const exclusion = effectType.targetParams.exclusion;
  const effectKind = effectType.kindId;
  switch (targetType) {
    case EffectTargetType.AllAllies: {
      const allAllies = state.championStates.filter((champion) => champion.team === ownerTeam);
      if (exclusion === TargetExclusion.Producer) {
        return allAllies.filter((champion) => champion.index !== ownerIndex);
      }
      return allAllies;
    }
    case EffectTargetType.AllEnemies: {
      return state.championStates.filter((champion) => champion.team !== ownerTeam);
    }
    case EffectTargetType.RandomEnemy: {
      return shuffle(
        state.random,
        state.championStates.filter((champion) => champion.team !== ownerTeam)
      ).slice(0, 1);
    }
    case EffectTargetType.RandomAlly: {
      return shuffle(
        state.random,
        state.championStates.filter((champion) => champion.team === ownerTeam)
      ).slice(0, 1);
    }
    case EffectTargetType.AllHeroes: {
      // Seer: Karma Burn
      return state.championStates;
    }
    case EffectTargetType.AllyWithHighestStamina: {
      return [
        state.championStates
          .filter((champion) => champion.team === ownerTeam)
          .sort((a, b) => b.turnMeter - a.turnMeter)[0],
      ];
    }
    case EffectTargetType.AllyWithLowestStamina: {
      return [
        state.championStates
          .filter((champion) => champion.team === ownerTeam)
          .sort((a, b) => a.turnMeter - b.turnMeter)[0],
      ];
    }
    case EffectTargetType.Boss: {
      return state.championStates.filter((champion) => champion.isBoss);
    }
    case EffectTargetType.EnemyWithHighestStamina: {
      return [
        state.championStates
          .filter((champion) => champion.team !== ownerTeam)
          .sort((a, b) => b.turnMeter - a.turnMeter)[0],
      ];
    }
    case EffectTargetType.EnemyWithLowestStamina: {
      return [
        state.championStates
          .filter((champion) => champion.team !== ownerTeam)
          .sort((a, b) => a.turnMeter - b.turnMeter)[0],
      ];
    }
    case EffectTargetType.Owner: {
      return [owner]; // e.g. when hit, heals self [whereas producer would be the enemy target]
    }
    case EffectTargetType.OwnerAllies: {
      return state.championStates.filter((champion) => champion.team === ownerTeam && champion.index !== ownerIndex);
    }
    case EffectTargetType.RelationProducer:
    case EffectTargetType.Producer: {
      return [owner]; // e.g. casts heal on self
    }
    case EffectTargetType.Target: {
      if (skillTargetsAlly(skill)) {
        if (ability.ability.targetIndex !== undefined && !isNaN(ability.ability.targetIndex)) {
          return [state.championStates[ability.ability.targetIndex]];
        }
        return state.championStates.filter((champion) => champion.team === ownerTeam).slice(0, 1);
      } else {
        return state.championStates.filter((champion) => champion.team !== ownerTeam).slice(0, 1);
      }
    }
    case EffectTargetType.RelationTarget: {
      if (!effectType.relation) {
        console.warn('No relation for effect', { effectType });
        return [];
      }
      const relationTargets = turnState.effectTargets[effectType.relation.effectTypeId];
      if (!relationTargets) {
        console.warn('No relation targets for effect', { effectType });
        return [];
      }
      return relationTargets.map((index) => state.championStates[index]);
    }
    default: {
      // console.warn(`Unknown target type ${targetType}`);
      return [];
    }
    case EffectTargetType.ActiveHero: // e.g. passive heals each ally on their own turns
    case EffectTargetType.HeroCausedRelationUnapply:
    case EffectTargetType.HeroThatKilledProducer:
    case EffectTargetType.MostInjuredAlly:
    case EffectTargetType.MostInjuredEnemy:
    case EffectTargetType.AllDeadAllies:
    case EffectTargetType.AllyWithLowestMaxHp: {
      return []; // TODO
    }
  }
}

export function selectEffectTargets(
  state: Readonly<BattleState>,
  ownerIndex: number,
  effectType: EffectType,
  turnState: TurnState,
  ability: AbilityState
): ChampionState[] {
  const result = selectTargetChampions(state, ownerIndex, effectType, turnState, ability);
  turnState.effectTargets[effectType.id] = result.map((champion) => champion.index);
  return result;
}
