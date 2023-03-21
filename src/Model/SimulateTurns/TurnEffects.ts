/* eslint-disable react-hooks/rules-of-hooks */
import {
  EffectKindId,
  EffectTargetType,
  EffectType,
  StatusEffectTypeId,
  TeamAttackParams,
} from '@raid-toolkit/webclient';
import { assert, cloneObject, shuffle } from '../../Common';
import { RTK } from '../../Data';
import { BattleState, BattleTurn, ChampionState, StatusEffect, TurnState } from '../Types';

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
    case EffectTargetType.RandomEnemy: {
      return shuffle(state.championStates.filter((champion) => champion.team !== ownerTeam)).slice(0, 1);
    }
    case EffectTargetType.RandomAlly: {
      return shuffle(state.championStates.filter((champion) => champion.team === ownerTeam)).slice(0, 1);
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
          EffectKindId.TeamAttack,
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

function selectAllyAttacks(
  state: Readonly<BattleState>,
  ownerIndex: number,
  params: TeamAttackParams
): ChampionState[] {
  const owner = state.championStates[ownerIndex];
  const ownerTeam = owner.team;

  const allies = shuffle(
    state.championStates.filter(
      (champion) => champion.team === ownerTeam && (!params.ExcludeProducerFromAttack || champion.index !== ownerIndex)
    )
  )
    .slice(0, params.TeammatesCount)
    .sort((a, b) => a.index - b.index);
  return allies;
}

function applyEffect(
  state: BattleState,
  ownerIndex: number,
  effect: EffectType,
  targets: ChampionState[],
  turnState: TurnState
) {
  for (const target of targets) {
    switch (effect.kindId) {
      case EffectKindId.Damage: {
        if (target.shieldHitsRemaining) {
          target.shieldHitsRemaining = Math.max(0, target.shieldHitsRemaining - 1);
        }
        turnState.hitsToPostProcess.push(target.index);
        break;
      }
      case EffectKindId.TeamAttack: {
        if (turnState.isProcessingAllyAttack) {
          break;
        }

        const allies = selectAllyAttacks(state, ownerIndex, effect.teamAttackParams!);

        turnState.isProcessingAllyAttack = true;
        try {
          for (const ally of allies) {
            useAbility(state, { championIndex: ally.index, abilityIndex: 0, state: cloneObject(state) });
          }
        } finally {
          turnState.isProcessingAllyAttack = false;
        }

        break;
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
            break;
          }
        } else if (effect.kindId === EffectKindId.ApplyDebuff) {
          effectList = target.debuffs;
          if (target.buffs.some((effect) => effect.typeId === StatusEffectTypeId.BlockDebuff)) {
            // TODO: Show this somewhere in the UI?
            console.log(`Debuffs blocked by BlockDebuffs :happyface:`);
            break;
          }
          if (target.shieldHitsRemaining) {
            // TODO: Show this somewhere in the UI?
            console.log(`Debuffs blocked by shield :angryface:`);
            break;
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
        break;
      }
    }
  }
}

export function useAbility(state: BattleState, turn: BattleTurn): void {
  const champion = state.championStates[turn.championIndex];
  const ability = champion.abilityState[turn.abilityIndex];

  // TODO: Process stun/freeze/sleep/etc

  // process effects
  const turnState: TurnState = (state.turnState = {
    hitsToPostProcess: [],
    turn,
    isProcessingAllyAttack: state.turnState?.isProcessingAllyAttack,
    isProcessingCounterAttack: state.turnState?.isProcessingCounterAttack,
  });
  try {
    const skill = RTK.skillTypes[ability.ability.skillTypeId];
    for (const effect of skill.effects) {
      for (let n = 0; n < effect.count; n++) {
        const targets = selectTargetIndexes(state, turn.championIndex, effect.targetParams!.targetType, effect.kindId);
        applyEffect(state, turn.championIndex, effect, targets, turnState);
      }
    }

    // HACK: This should come from passive FK skill
    if (champion.shieldHitsRemaining !== undefined) {
      champion.shieldHitsRemaining = state.args.shieldHits;
    }

    if (!turnState.isProcessingCounterAttack) {
      turnState.isProcessingCounterAttack = true;
      const postProcessHits = new Set(turnState.hitsToPostProcess);
      for (const index of postProcessHits) {
        const target = state.championStates[index];
        if (target.buffs.some((effect) => effect.typeId === StatusEffectTypeId.Counterattack)) {
          useAbility(state, { championIndex: index, abilityIndex: 0, state: cloneObject(state) });
        }
      }
      turnState.isProcessingCounterAttack = false;
    }
  } finally {
    delete state.turnState;
  }
}
