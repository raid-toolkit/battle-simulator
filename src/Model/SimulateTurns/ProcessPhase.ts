import { EffectGroup, EffectKindId, StatusEffectTypeId } from '@raid-toolkit/webclient';
import { RTK } from '../../Data';
import { BattlePhaseId, BattleState, ChampionState, ExpressionBuilderVariable } from '../Types';

export interface ExpressionContext {
  variables: Partial<Record<keyof typeof ExpressionBuilderVariable, number>>;
}

export function processAfterEffectProcessedOnTarget(
  state: BattleState,
  relationOwner: ChampionState,
  relationTarget: ChampionState,
  effectKind: StatusEffectTypeId
) {
  const championStates = state.championStates.map((champion) => champion);
  // TODO:
  for (const skillOwnerState of championStates) {
    const heroType = RTK.heroTypes[skillOwnerState.setup.typeId];
    const context: ExpressionContext = {
      variables: {
        relationTargetIsAlly: relationTarget.team === skillOwnerState.team ? 1 : 0,
        relationProcessedTargetCount: 0, // TODO: what should this really be set to?
        statusEffectIsApplied: 1,
      },
    };
    const skills = heroType.skillTypeIds.map((typeId) => RTK.skillTypes[typeId]);
    for (const skill of skills) {
      const passives = skill.effects.filter(
        (effect) =>
          effect.group === EffectGroup.Passive &&
          effect.relation?.phase.includes(BattlePhaseId.AfterEffectProcessedOnTarget) &&
          effect.relation.effectTypeId === effectKind
      );
      for (const passive of passives) {
        // owner(4) gets TM boost
        // relation(2) gets TM reduction
        let { condition } = passive;
        for (const [key, value] of Object.entries(context.variables)) {
          condition = condition.replace(key, value.toString());
        }
        // why do I trust plarium to not put stupid shit in here?
        // why?
        // fuck it. I'm lazy
        // eslint-disable-next-line no-eval
        if (!!eval(condition)) {
        }
      }
    }
  }
}
