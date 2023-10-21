/* eslint-disable react-hooks/rules-of-hooks */
import { EffectKindId, EffectType, SkillType, StatusEffectTypeId, TeamAttackParams } from '@raid-toolkit/webclient';
import { assert, cloneObject, debugAssert, shuffle } from '../../Common';
import {
  AbilitySetup,
  AbilityState,
  BattleState,
  BlessingTypeId,
  ChampionState,
  ExpressionBuilderVariable,
  ExpressionVars,
  RarityId,
  StatusEffect,
  TurnState,
} from '../Types';
import { evalExpression } from './Expression';
import { processAbility } from './ProcessAbility';
import { RTK } from '../../Data';
import { getSkillChanceUpgrade } from './Helpers';

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

function selectAllyAttacks(
  state: Readonly<BattleState>,
  ownerIndex: number,
  params: TeamAttackParams
): ChampionState[] {
  const owner = state.championStates[ownerIndex];
  const ownerTeam = owner.team;

  const count = params.TeammatesCount > 0 ? params.TeammatesCount : 6;
  const allies = shuffle(
    state.random,
    state.championStates.filter((champion) => champion.team === ownerTeam && champion.index !== ownerIndex)
  )
    .slice(0, count)
    .sort((a, b) => a.index - b.index);

  if (!params.ExcludeProducerFromAttack) {
    allies.splice(0, 0, owner);
  }
  return allies;
}

export function applyEffect(
  state: BattleState,
  ownerIndex: number,
  abilitySetup: AbilitySetup,
  skill: SkillType,
  effect: EffectType,
  targets: ChampionState[],
  turnState: TurnState
) {
  const owner = state.championStates[ownerIndex];
  for (const target of targets) {
    const ownerType = RTK.heroTypes[owner.setup.typeId];
    const targetType = RTK.heroTypes[target.setup.typeId];
    const relTarget = target; // TODO: Update to use effect info
    const expVars: ExpressionVars = {
      // [ExpressionBuilderVariable.targetId]: state.championStates.indexOf(target);
      [ExpressionBuilderVariable.isOwnersTurn]: target.index === state.currentTurnOwner ? 1 : 0,
      [ExpressionBuilderVariable.targetId]: target.index,
      [ExpressionBuilderVariable.producerId]: ownerIndex,
      [ExpressionBuilderVariable.targetBaseTypeId]: target.setup.typeId - (target.setup.typeId % 6),
      [ExpressionBuilderVariable.skillProducerBaseTypeId]: owner.setup.typeId - (owner.setup.typeId % 6),

      [ExpressionBuilderVariable.TRG_RARITY]: RarityId[targetType.rarity],
      [ExpressionBuilderVariable.TRG_BUFF_COUNT]: target.buffs.length,
      [ExpressionBuilderVariable.TRG_DEBUFF_COUNT]: target.debuffs.length,
      [ExpressionBuilderVariable.TRG_STAMINA]: target.turnMeter,
      [ExpressionBuilderVariable.REL_TRG_STAMINA]: relTarget.turnMeter,
      // [ExpressionBuilderVariable.targetFactionId]: targetType.faction,
      [ExpressionBuilderVariable.RARITY]: RarityId[ownerType.rarity],
      [ExpressionBuilderVariable.BUFF_COUNT]: owner.debuffs.length,
      [ExpressionBuilderVariable.DEBUFF_COUNT]: owner.debuffs.length,
    };

    if (effect.condition && !evalExpression(state, target, effect.condition, expVars)) {
      continue;
    }

    const addedChance = getSkillChanceUpgrade(skill);
    const mods = abilitySetup.effectMods?.[effect.id];
    if (mods?.disabled) {
      continue;
    }

    if (target.immuneToEffectKinds?.includes(effect.kindId)) continue;

    switch (effect.kindId) {
      case EffectKindId.Damage: {
        if (effect.chance && state.random() > effect.chance + addedChance) {
          continue; // failed chance
        }

        if (typeof target.shieldHitsRemaining === 'number') {
          target.shieldHitsRemaining = Math.max(0, target.shieldHitsRemaining - 1);
          if (owner.phantomTouchCooldown === 0 && owner.setup.blessing === BlessingTypeId.MagicOrb) {
            owner.phantomTouchCooldown = 1;
            target.shieldHitsRemaining = Math.max(0, target.shieldHitsRemaining - 1);
          }
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
            processAbility(state, {
              bossTurnCount: -1,
              totalTurnCount: -1,
              groupIndex: -1,
              championIndex: ally.index,
              abilityIndex: 0,
              state: cloneObject(state),
            });
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
            // console.log(`Buffs blocked by BlockBuffs :sadface:`);
            break;
          }
        } else if (effect.kindId === EffectKindId.ApplyDebuff) {
          effectList = target.debuffs;
          if (target.buffs.some((effect) => effect.typeId === StatusEffectTypeId.BlockDebuff)) {
            // TODO: Show this somewhere in the UI?
            // console.log(`Debuffs blocked by BlockDebuffs :happyface:`);
            break;
          }
          if (target.shieldHitsRemaining) {
            // TODO: Show this somewhere in the UI?
            // console.log(`Debuffs blocked by shield :angryface:`);
            break;
          }
        } else {
          assert(false, `Unexpected effect kind ${effect.kindId}`);
        }

        for (const statusEffectIndex in statusEffects) {
          const statusEffect = statusEffects[statusEffectIndex];
          if (mods?.disabledStatusEffectIndexes?.[statusEffectIndex]) {
            continue;
          }

          if (target.immuneToEffectTypes?.includes(statusEffect.typeId)) {
            continue;
          }
          const existingEffect = effectList.find(
            (effect) =>
              effect.typeId === statusEffect.typeId || effect.typeId === statusEffectSuperiorTo[statusEffect.typeId]
          );
          // can we extend an existing effect?
          if (
            existingEffect &&
            ![
              StatusEffectTypeId.ContinuousHeal075p,
              StatusEffectTypeId.ContinuousHeal15p,
              StatusEffectTypeId.ContinuousDamage025p,
              StatusEffectTypeId.ContinuousDamage5p,
              StatusEffectTypeId.Burn,
              StatusEffectTypeId.TimeBomb,
            ].includes(statusEffect.typeId)
          ) {
            if (effect.chance && state.random() > effect.chance + addedChance) {
              continue; // failed chance
            }

            existingEffect.duration = Math.max(statusEffect.duration, existingEffect.duration);
            existingEffect.typeId = statusEffect.typeId;
            continue;
          }

          // exceeded effect limit
          if (effectList.length >= 10 && !statusEffect.ignoreEffectsLimit) {
            // TODO: Show this in the UI somehow?
            continue;
          }
          const effectToApply: StatusEffect = {
            duration: statusEffect.duration,
            typeId: statusEffect.typeId,
          };

          // unholy hack of hacks. actually it's not bad, but fuck me.
          if (
            target.isBoss &&
            Math.floor(target.setup.typeId / 100) === 265 &&
            statusEffect.typeId === StatusEffectTypeId.Freeze
          ) {
            // get the count
            let count = 1;
            let rootEffect: EffectType | undefined = effect;
            while (rootEffect?.relation?.effectTypeId) {
              // eslint-disable-next-line no-loop-func
              rootEffect = skill.effects.find((effect) => effect.id === rootEffect?.relation?.effectTypeId);
            }
            if (rootEffect && rootEffect !== effect) {
              count *= rootEffect.count;
            }

            // apply odds to each debuff
            for (let nFreeze = 0; nFreeze < count; ++nFreeze) {
              if (effect.chance && state.random() > effect.chance + addedChance) {
                continue; // failed chance
              }
              target.turnMeter = Math.max(target.turnMeter - 15, 0);
            }
            // debuff gets removed immediately, so just don't apply it after reducing turn meter
            break;
          }

          if (effect.chance && state.random() > effect.chance + addedChance) {
            break; // failed chance
          }
          effectList.push(effectToApply);
        }
        break;
      }
      case EffectKindId.RemoveDebuff: {
        const params = effect.unapplyStatusEffectParams;
        if (!params) {
          console.warn('Missing unapplyStatusEffectParams', { effect });
          target.debuffs = [];
          break;
        }
        let count = params.count !== -1 ? params.count : target.debuffs.length;
        while (count > 0 && target.debuffs.length > 0) {
          if (effect.chance && state.random() > effect.chance + addedChance) {
            continue; // failed chance
          }
          if (params.statusEffectTypeIds?.length) {
            const index = target.debuffs.findIndex((effect) => params.statusEffectTypeIds.includes(effect.typeId));
            if (index !== -1) {
              target.debuffs.splice(index, 1);
            } else {
              break;
            }
          } else {
            // TODO: Should this be predictable or random?
            target.debuffs.pop();
          }
        }
        break;
      }
      case EffectKindId.IncreaseBuffLifetime: {
        const params = effect.changeEffectLifetimeParams;
        if (!params) {
          console.warn('Missing increaseBuffLifetimeParams', { effect });
          break;
        }

        let count = params.count !== -1 ? params.count : target.buffs.length;
        while (count > 0 && target.buffs.length > 0) {
          if (effect.chance && state.random() > effect.chance + addedChance) {
            continue; // failed chance
          }

          if (params.effectTypeIds?.length) {
            const buff = target.buffs.find((effect) => params.effectTypeIds.includes(effect.typeId));
            if (buff) {
              buff.duration += params.turns;
            } else {
              break;
            }
          } else {
            // TODO: Should this be predictable or random?
            target.buffs[count - 1].duration += params.turns;
          }
          --count;
        }
        break;
      }
      case EffectKindId.ReduceStamina: {
        if (Math.floor(target.setup.typeId / 100) === 265) break; // Fyro is immune to TM decreases
        const tmIncrease = evalExpression(state, target, effect.multiplier, expVars);
        target.turnMeter -= tmIncrease;
        break;
      }
      case EffectKindId.IncreaseStamina: {
        const tmIncrease = evalExpression(state, target, effect.multiplier, expVars);
        target.turnMeter += tmIncrease;
        break;
      }
      case EffectKindId.GiveTurn: {
        target.takeImmediateTurn = true;
        break;
      }
      case EffectKindId.ExtraTurn: {
        if (effect.chance !== 1 && effect.chance !== null) {
          // don't count non-guaranteed turns
          break;
        }
        if (effect.condition && !evalExpression(state, target, effect.condition, expVars)) {
          // can't proc extra turn
          // TODO: Add debug logging?
          break;
        }
        expVars[ExpressionBuilderVariable.targetIsAlreadyHasExtraTurn] = 1;
        state.turnQueue.push(target.index);
        break;
      }
      case EffectKindId.ReduceCooldown: {
        const params = effect.changeSkillCooldownParams;
        if (!params) {
          console.warn('Missing changeSkillCooldownParams', { effect });
          break;
        }
        if (params.skillIndex !== undefined) {
          debugAssert(params.skillToChange);
        }
        const abilities = target.abilityState.reduce<AbilityState[]>((acc, ability) => {
          if (acc.length > params.skillToChange || ability.cooldownRemaining === 0) {
            return acc;
          }
          if (params.skillIndex === null || ability.index === params.skillIndex) {
            return acc.concat(ability);
          }
          return acc;
        }, [] as AbilityState[]);
        for (const ability of abilities) {
          ability.cooldownRemaining = params.turns === -1 ? 0 : Math.max(0, ability.cooldownRemaining - params.turns);
        }
        break;
      }
      default: {
        // console.warn('Unhandled effect kindId', { effect });
      }
    }
  }
}
