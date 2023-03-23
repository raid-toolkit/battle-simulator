import { BattleState } from '../Types';

export function processValkyrieBuff(state: BattleState) {
  const valkyries = state.championStates.filter(
    (champState) => champState.setup.typeId >= 2160 && champState.setup.typeId <= 2166
  );
  for (const valk of valkyries) {
    valk.turnMeter += 10;
  }
}
