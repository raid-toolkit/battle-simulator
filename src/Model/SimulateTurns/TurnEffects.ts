/* eslint-disable react-hooks/rules-of-hooks */
import { EffectKindId, EffectType, StatusEffectTypeId, TeamAttackParams } from '@raid-toolkit/webclient';
import { assert, cloneObject, shuffle } from '../../Common';
import { RTK } from '../../Data';
import { BattleState, BattleTurn, ChampionState, StatusEffect, TurnState } from '../Types';
import { selectEffectTargets } from './EffectTargets';

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
    effectTargets: {},
  });
  try {
    const skill = RTK.skillTypes[ability.ability.skillTypeId];
    for (const effect of skill.effects) {
      for (let n = 0; n < effect.count; n++) {
        const targets = selectEffectTargets(state, turn.championIndex, effect, turnState);
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
