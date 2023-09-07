import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import { cloneObject } from '../../Common';
import { RTK } from '../../Data';
import { BattleState, BattleTurn, TurnState } from '../Types';
import { selectEffectTargets } from './EffectTargets';
import { applyEffect } from './TurnEffects';
import { processValkyrieBuff } from './ValkyrieHack';

export function processAbility(state: BattleState, turn: BattleTurn): void {
  const champion = state.championStates[turn.championIndex];
  const ability = champion.abilityState[turn.abilityIndex];

  // TODO: Process stun/freeze/sleep/etc
  // process effects
  const turnState: TurnState = (state.turnState = {
    hitsToPostProcess: [],
    turn,
    isProcessingAllyAttack: state.turnState?.isProcessingAllyAttack,
    isProcessingCounterAttack: state.turnState?.isProcessingCounterAttack,
    abilityVariables: state.turnState?.abilityVariables || {},
    effectTargets: {},
  });
  try {
    const skill = RTK.skillTypes[ability.ability.skillTypeId];
    for (const effect of skill.effects) {
      for (let n = 0; n < effect.count; n++) {
        const targets = selectEffectTargets(state, turn.championIndex, effect, turnState);
        applyEffect(state, turn.championIndex, ability.ability, skill, effect, targets, turnState);
      }
    }

    // HACK: This should come from passive FK skill
    if (champion.shieldHitsRemaining !== undefined) {
      champion.shieldHitsRemaining = champion.fullShieldHits;;
      // hack me daddy
      processValkyrieBuff(state);
    }

    if (!turnState.isProcessingCounterAttack) {
      turnState.isProcessingCounterAttack = true;
      const postProcessHits = new Set(turnState.hitsToPostProcess);
      for (const index of postProcessHits) {
        const target = state.championStates[index];
        if (target.buffs.some((effect) => effect.typeId === StatusEffectTypeId.Counterattack)) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          processAbility(state, {
            bossTurnIndex: -1,
            championIndex: index,
            abilityIndex: 0,
            state: cloneObject(state),
          });
        }
      }
      turnState.isProcessingCounterAttack = false;
    }
  } finally {
    delete state.turnState;
  }
}
