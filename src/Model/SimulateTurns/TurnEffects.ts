import { EffectKindId, EffectTargetType, EffectType, StatusEffectTypeId } from '@raid-toolkit/webclient';
import { assert, cloneObject } from '../../Common';
import { RTK } from '../../Data';
import { BattleState, BattleTurn, ChampionState, StatusEffect } from '../Types';

export function hitChampions(state: BattleState, targets: ChampionState[]) {
  // TODO: Handle buffs
}

const statusEffectSuperiorTo: Partial<Record<StatusEffectTypeId, StatusEffectTypeId>> = {
  [StatusEffectTypeId.BlockHeal100p]: StatusEffectTypeId.BlockHeal50p,
  [StatusEffectTypeId.DecreaseAccuracy50]: StatusEffectTypeId.DecreaseAccuracy25,
  [StatusEffectTypeId.DecreaseAttack50]: StatusEffectTypeId.DecreaseAttack25,
  [StatusEffectTypeId.DecreaseDefence60]: StatusEffectTypeId.DecreaseDefence30,
  [StatusEffectTypeId.DecreaseSpeed30]: StatusEffectTypeId.DecreaseSpeed15,
  [StatusEffectTypeId.DecreaseCriticalChance30]: StatusEffectTypeId.DecreaseCriticalChance15,
  [StatusEffectTypeId.DecreaseCriticalDamage25p]: StatusEffectTypeId.DecreaseCriticalDamage15p,
  [StatusEffectTypeId.IncreaseAccuracy50]: StatusEffectTypeId.IncreaseAccuracy25,
  [StatusEffectTypeId.IncreaseAttack50]: StatusEffectTypeId.IncreaseAttack25,
  [StatusEffectTypeId.IncreaseCriticalChance30]: StatusEffectTypeId.IncreaseCriticalChance15,
  [StatusEffectTypeId.IncreaseCriticalDamage30]: StatusEffectTypeId.IncreaseCriticalDamage15,
  [StatusEffectTypeId.IncreaseDamageTaken25]: StatusEffectTypeId.IncreaseDamageTaken15,
  [StatusEffectTypeId.IncreaseDefence60]: StatusEffectTypeId.IncreaseDefence30,
  [StatusEffectTypeId.IncreasePoisoning50]: StatusEffectTypeId.IncreasePoisoning25,
  [StatusEffectTypeId.IncreaseSpeed30]: StatusEffectTypeId.IncreaseSpeed15,
  [StatusEffectTypeId.ReduceDamageTaken25]: StatusEffectTypeId.ReduceDamageTaken15,
  [StatusEffectTypeId.ReflectDamage30]: StatusEffectTypeId.ReflectDamage15,
  [StatusEffectTypeId.ShareDamage50]: StatusEffectTypeId.ShareDamage25,
};

function selectTargetIndexes(
  state: Readonly<BattleState>,
  ownerIndex: number,
  targetType: EffectTargetType,
  effectKind: EffectKindId
): ChampionState[] {
  const owner = state.championStates[ownerIndex];
  const ownerTeam = owner.team;
  switch (targetType) {
    case EffectTargetType.AllAllies: {
      return state.championStates.filter((champion) => champion.team === ownerTeam);
    }
    case EffectTargetType.AllEnemies: {
      return state.championStates.filter((champion) => champion.team !== ownerTeam);
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
    case EffectTargetType.Producer: {
      return [owner]; // e.g. casts heal on self
    }
    case EffectTargetType.Target: {
      if (
        [
          EffectKindId.ApplyBuff,
          EffectKindId.Heal,
          EffectKindId.MultiplyBuff,
          EffectKindId.IncreaseBuffLifetime,
          EffectKindId.ReduceDebuffLifetime,
        ].includes(effectKind)
      ) {
        return state.championStates.filter((champion) => champion.team === ownerTeam).slice(0, 1);
      }
      if (
        [
          EffectKindId.ApplyDebuff,
          EffectKindId.Damage,
          EffectKindId.MultiplyDebuff,
          EffectKindId.IncreaseDebuffLifetime,
          EffectKindId.ReduceBuffLifetime,
        ].includes(effectKind)
      ) {
        return state.championStates.filter((champion) => champion.team !== ownerTeam).slice(0, 1);
      }
      console.warn(`Unknown effect type ${effectKind}`);
      return [];
    }
    default: {
      console.warn(`Unknown target type ${targetType}`);
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

function applyEffect(effect: EffectType, targets: ChampionState[]) {
  for (const target of targets) {
    switch (effect.kindId) {
      case EffectKindId.Damage: {
        if (target.shieldHitsRemaining) {
          target.shieldHitsRemaining = Math.max(0, target.shieldHitsRemaining - effect.count);
        }
        return;
      }
      case EffectKindId.ApplyBuff:
      case EffectKindId.ApplyDebuff: {
        const statusEffects = effect.applyStatusEffectParams?.statusEffectInfos;
        assert(statusEffects);

        let effectList: StatusEffect[];
        if (effect.kindId === EffectKindId.ApplyBuff) {
          effectList = target.buffs;
          if (target.debuffs.some((effect) => effect.typeId === StatusEffectTypeId.BlockBuffs)) {
            // TODO: Show this somewhere in the UI?
            console.log(`Buffs blocked by BlockBuffs :sadface:`);
            return;
          }
        } else if (effect.kindId === EffectKindId.ApplyDebuff) {
          effectList = target.debuffs;
          if (target.buffs.some((effect) => effect.typeId === StatusEffectTypeId.BlockDebuff)) {
            // TODO: Show this somewhere in the UI?
            console.log(`Debuffs blocked by BlockDebuffs :happyface:`);
            return;
          }
          if (target.shieldHitsRemaining) {
            // TODO: Show this somewhere in the UI?
            console.log(`Debuffs blocked by shield :angryface:`);
            return;
          }
        } else {
          assert(false, `Unexpected effect kind ${effect.kindId}`);
        }

        for (const statusEffect of statusEffects) {
          if (target.immuneTo?.includes(statusEffect.typeId)) {
            continue;
          }
          const existingEffect = effectList.find(
            (effect) =>
              effect.typeId === statusEffect.typeId || effect.typeId === statusEffectSuperiorTo[statusEffect.typeId]
          );
          // can we extend an existing effect?
          if (
            existingEffect &&
            [
              StatusEffectTypeId.ContinuousHeal075p,
              StatusEffectTypeId.ContinuousHeal15p,
              StatusEffectTypeId.ContinuousDamage025p,
              StatusEffectTypeId.ContinuousDamage5p,
              StatusEffectTypeId.Burn,
            ].includes(statusEffect.typeId)
          ) {
            existingEffect.duration = Math.max(statusEffect.duration, existingEffect.duration);
            existingEffect.typeId = statusEffect.typeId;
            continue;
          }

          // exceeded effect limit
          if (effectList.length > 10 && !statusEffect.ignoreEffectsLimit) {
            // TODO: Show this in the UI somehow?
            continue;
          }
          effectList.push({
            duration: statusEffect.duration,
            typeId: statusEffect.typeId,
          });
        }
        return;
      }
    }
  }
}

export function useAbility(state: BattleState, championIndex: number, abilityIndex: number): BattleTurn {
  const snapshot = cloneObject(state);
  const champion = state.championStates[championIndex];
  const ability = champion.abilityState[abilityIndex];

  if (!champion.isBoss) {
    const boss = state.championStates.find((targetState) => targetState.isBoss);
    assert(boss, 'No boss found');

    if (ability.ability.hits) {
      boss.shieldHitsRemaining = Math.max(0, (boss.shieldHitsRemaining ?? 0) - ability.ability.hits);
    }
  } else {
    champion.shieldHitsRemaining = state.args.shieldHits;
    const targets = state.championStates.filter((targetState) => !targetState.isBoss);
    hitChampions(state, targets);
    // TODO apply new debuffs to targets
    // TODO apply boss debuffs (e.g. poison, hp burn, brimstone)
  }

  // process effects
  const skill = RTK.skillTypes[ability.ability.skillTypeId];
  for (const effect of skill.effects) {
    const targets = selectTargetIndexes(state, championIndex, effect.targetParams!.targetType, effect.kindId);
    applyEffect(effect, targets);
  }

  return {
    championIndex,
    abilityIndex,
    state: snapshot,
  };
}
