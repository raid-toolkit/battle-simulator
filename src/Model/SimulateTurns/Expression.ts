import { ExpressionBuilderVariable } from '../Types';

const constantVars: Partial<Record<ExpressionBuilderVariable, number>> = {
  [ExpressionBuilderVariable.MAX_STAMINA]: 100,
};

export function evalExpression(expression: string, vars: Partial<Record<ExpressionBuilderVariable, number>>): number {
  const allVars = { ...constantVars, ...vars };
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
