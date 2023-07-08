import { BattleState, ExpressionBuilderFunction, ExpressionBuilderVariable, ExpressionVars } from '../Types';

const constantVars: ExpressionVars = {
  [ExpressionBuilderVariable.MAX_STAMINA]: 100,
  [ExpressionBuilderVariable.isCritical]: 1,
  [ExpressionBuilderVariable.canUniqueApplyForBaseEffect]: 0,
  [ExpressionBuilderVariable.isOwnersTurn]: 1, // TODO
  [ExpressionBuilderVariable.effectProducerIsSkillProducer]: 1, // ?
  [ExpressionBuilderVariable.CHANGED_STAMINA_AMOUNT]: 0,
};

function getExpressionContext(
  state: BattleState
): Partial<Record<keyof typeof ExpressionBuilderFunction, (arg_0: number) => number | boolean>> {
  return {
    ABS: Math.abs,
    FLOOR: Math.floor,
    AllyTeamContainsHero(typeId: number) {
      if (state.turnState?.turn?.championIndex === undefined) return false;
      const team = state.championStates[state.turnState.turn.championIndex].team;
      return state.championStates.some((champion) => champion.team === team && champion.setup.typeId === typeId);
    },
  };
}

const ExpressionBuilderVariableNames = (
  Object.values(ExpressionBuilderVariable).filter(
    (value) => typeof value === 'string'
  ) as (keyof typeof ExpressionBuilderVariable)[]
).sort((a, b) => b.length - a.length);

const ExpressionBuilderFunctionNames = (
  Object.values(ExpressionBuilderFunction).filter(
    (value) => typeof value === 'string'
  ) as (keyof typeof ExpressionBuilderFunction)[]
).sort((a, b) => b.length - a.length);

export function evalExpression(state: BattleState, expression: string, vars: ExpressionVars = {}): number {
  const allVars = { ...constantVars, ...state.turnVariables, ...vars };
  for (const key of ExpressionBuilderVariableNames) {
    expression = expression.replace(key, (allVars[ExpressionBuilderVariable[key]] ?? 0).toString());
  }
  for (const key of ExpressionBuilderFunctionNames) {
    expression = expression.replace(key as string, `context.${key}`);
  }
  try {
    // used by eval()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const context = getExpressionContext(state);
    // eslint-disable-next-line no-eval
    return eval(expression);
  } catch (e) {
    // console.error(`Failed to evaluate expression: ${expression}`);
    return 0;
  }
}
