import { BattleState, ExpressionBuilderVariable, ExpressionVars } from '../Types';

const constantVars: ExpressionVars = {
  [ExpressionBuilderVariable.MAX_STAMINA]: 100,
  [ExpressionBuilderVariable.canUniqueApplyForBaseEffect]: 1,
  [ExpressionBuilderVariable.isOwnersTurn]: 1, // TODO
  [ExpressionBuilderVariable.effectProducerIsSkillProducer]: 1, // ?
};

export function evalExpression(state: BattleState, expression: string, vars: ExpressionVars = {}): number {
  const allVars = { ...constantVars, ...state.turnVariables, ...vars };
  for (const [key, value] of Object.entries(allVars)) {
    expression = expression.replace(ExpressionBuilderVariable[key as any], value.toString());
  }
  try {
    // eslint-disable-next-line no-eval
    return eval(expression);
  } catch (e) {
    console.error(`Failed to evaluate expression: ${expression}`);
    return 0;
  }
}
