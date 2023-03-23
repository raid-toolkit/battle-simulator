/* eslint-disable react-hooks/rules-of-hooks */
import { EffectKindId, EffectType, StatusEffectTypeId, TeamAttackParams } from '@raid-toolkit/webclient';
import { assert, cloneObject, shuffle } from '../../Common';
import { BattleState, ChampionState, StatusEffect, TurnState } from '../Types';
import { useAbility } from './ProcessAbility';

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

  const allies = shuffle(
    state.championStates.filter(
      (champion) => champion.team === ownerTeam && (!params.ExcludeProducerFromAttack || champion.index !== ownerIndex)
    )
  )
    .slice(0, params.TeammatesCount)
    .sort((a, b) => a.index - b.index);
  return allies;
}

export function applyEffect(
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
            ![
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
      case EffectKindId.RemoveDebuff: {
        const params = effect.unapplyStatusEffectParams;
        if (!params) {
          console.warn('Missing unapplyStatusEffectParams', { effect });
          target.debuffs = [];
          break;
        }
        let count = params.count !== -1 ? params.count : target.debuffs.length;
        while (count > 0 && target.debuffs.length > 0) {
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
      default: {
        console.warn('Unhandled effect kindId', { effect });
      }
    }
  }
}
