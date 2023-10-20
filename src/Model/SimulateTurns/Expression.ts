import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import {
  BattleState,
  ChampionState,
  ExpressionBuilderFunction,
  ExpressionBuilderVariable,
  ExpressionVars,
} from '../Types';

const constantVars: ExpressionVars = {
  [ExpressionBuilderVariable.MAX_STAMINA]: 100,
  [ExpressionBuilderVariable.isCritical]: 1,
  [ExpressionBuilderVariable.canUniqueApplyForBaseEffect]: 0,
  [ExpressionBuilderVariable.isOwnersTurn]: 1, // TODO
  [ExpressionBuilderVariable.effectProducerIsSkillProducer]: 1, // ?
  [ExpressionBuilderVariable.CHANGED_STAMINA_AMOUNT]: 0,
};

function getExpressionContext(
  state: BattleState,
  target: ChampionState
): Partial<
  Record<
    keyof typeof ExpressionBuilderFunction,
    ((arg_0: number) => number | boolean) | ((arg_0: string) => number | boolean)
  >
> {
  return {
    ABS: Math.abs,
    FLOOR: Math.floor,
    AllyTeamContainsHero(typeId: number) {
      if (state.turnState?.turn?.championIndex === undefined) return false;
      const team = state.championStates[state.turnState.turn.championIndex].team;
      return state.championStates.some((champion) => champion.team === team && champion.setup.typeId === typeId);
    },
    TargetHasEffectOfKind(...anyKindIds: StatusEffectTypeId[]) {
      return target.buffs.concat(target.debuffs).some((effect) => anyKindIds.includes(effect.typeId));
    },
    RelationTargetHasEffectOfKind(...anyKindIds: StatusEffectTypeId[]) {
      return target.buffs.concat(target.debuffs).some((effect) => anyKindIds.includes(effect.typeId));
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

const Constants: Record<string, string> = {
  Stun_KindId: [StatusEffectTypeId.Stun].join(','),
  Freeze_KindId: [StatusEffectTypeId.Freeze].join(','),
  Sleep_KindId: [StatusEffectTypeId.Sleep].join(','),
  Provoke_KindId: [StatusEffectTypeId.Provoke].join(','),
  Counterattack_KindId: [StatusEffectTypeId.Counterattack].join(','),
  BlockDamage_KindId: [StatusEffectTypeId.BlockDamage].join(','),
  BlockHeal_KindId: [StatusEffectTypeId.BlockHeal100p, StatusEffectTypeId.BlockHeal50p].join(','),
  ContinuousDamage_KindId: [StatusEffectTypeId.ContinuousDamage5p, StatusEffectTypeId.ContinuousDamage025p].join(','),
  ContinuousHeal_KindId: [StatusEffectTypeId.ContinuousHeal075p, StatusEffectTypeId.ContinuousHeal15p].join(','),
  BlockDebuff_KindId: [StatusEffectTypeId.BlockDebuff].join(','),
  BlockBuffs_KindId: [StatusEffectTypeId.BlockBuffs].join(','),
  IncreaseAttack_KindId: [StatusEffectTypeId.IncreaseAttack25, StatusEffectTypeId.IncreaseAttack50].join(','),
  DecreaseAttack_KindId: [StatusEffectTypeId.DecreaseAttack25, StatusEffectTypeId.DecreaseAttack50].join(','),
  IncreaseDefence_KindId: [StatusEffectTypeId.IncreaseDefence30, StatusEffectTypeId.IncreaseDefence60].join(','),
  DecreaseDefence_KindId: [StatusEffectTypeId.DecreaseDefence30, StatusEffectTypeId.DecreaseDefence60].join(','),
  IncreaseSpeed_KindId: [StatusEffectTypeId.IncreaseSpeed15, StatusEffectTypeId.IncreaseSpeed30].join(','),
  DecreaseSpeed_KindId: [StatusEffectTypeId.DecreaseSpeed15, StatusEffectTypeId.DecreaseSpeed30].join(','),
  IncreaseAccuracy_KindId: [StatusEffectTypeId.IncreaseAccuracy25, StatusEffectTypeId.IncreaseAccuracy50].join(','),
  DecreaseAccuracy_KindId: [StatusEffectTypeId.DecreaseAccuracy25, StatusEffectTypeId.DecreaseAccuracy50].join(','),
  IncreaseCriticalChance_KindId: [
    StatusEffectTypeId.IncreaseCriticalChance15,
    StatusEffectTypeId.IncreaseCriticalChance30,
  ].join(','),
  DecreaseCriticalChance_KindId: [
    StatusEffectTypeId.DecreaseCriticalChance15,
    StatusEffectTypeId.DecreaseCriticalChance30,
  ].join(','),
  IncreaseCriticalDamage_KindId: [
    StatusEffectTypeId.IncreaseCriticalDamage15,
    StatusEffectTypeId.IncreaseCriticalDamage30,
  ].join(','),
  DecreaseCriticalDamage_KindId: [
    StatusEffectTypeId.DecreaseCriticalDamage15p,
    StatusEffectTypeId.DecreaseCriticalDamage25p,
  ].join(','),
  Shield_KindId: [StatusEffectTypeId.Shield].join(','),
  BlockActiveSkills_KindId: [StatusEffectTypeId.BlockActiveSkills].join(','),
  ReviveOnDeath_KindId: [StatusEffectTypeId.ReviveOnDeath].join(','),
  ShareDamage_KindId: [StatusEffectTypeId.ShareDamage50, StatusEffectTypeId.ShareDamage25].join(','),
  Unkillable_KindId: [StatusEffectTypeId.Unkillable].join(','),
  TimeBomb_KindId: [StatusEffectTypeId.TimeBomb].join(','),
  DamageCounter_KindId: [StatusEffectTypeId.DamageCounter].join(','),
  IncreaseDamageTaken_KindId: [StatusEffectTypeId.IncreaseDamageTaken25, StatusEffectTypeId.IncreaseDamageTaken15].join(
    ','
  ),
  BlockRevive_KindId: [StatusEffectTypeId.BlockRevive].join(','),
  ArtifactSet_Shield_KindId: [StatusEffectTypeId.ArtifactSet_Shield].join(','),
  ReflectDamage_KindId: [StatusEffectTypeId.ReflectDamage15, StatusEffectTypeId.ReflectDamage30].join(','),
  MinotaurIncreaseDamage_KindId: [StatusEffectTypeId.MinotaurIncreaseDamage].join(','),
  MinotaurIncreaseDamageTaken_KindId: [StatusEffectTypeId.MinotaurIncreaseDamageTaken].join(','),
  HydraNeckIncreaseDamageTaken_KindId: [StatusEffectTypeId.HydraNeckIncreaseDamageTaken].join(','),
  Mark_KindId: [StatusEffectTypeId.Mark].join(','),
  HitCounterShield_KindId: [StatusEffectTypeId.HitCounterShield].join(','),
  LifeDrainOnDamage10p_KindId: [StatusEffectTypeId.LifeDrainOnDamage10p].join(','),
  Burn_KindId: [StatusEffectTypeId.Burn].join(','),
  Invisible_KindId: [StatusEffectTypeId.Invisible1, StatusEffectTypeId.Invisible2].join(','),
  Invisible1_KindId: [StatusEffectTypeId.Invisible1].join(','),
  Invisible2_KindId: [StatusEffectTypeId.Invisible2].join(','),
  Fear_KindId: [StatusEffectTypeId.Fear1, StatusEffectTypeId.Fear2].join(','),
  Fear1_KindId: [StatusEffectTypeId.Fear1].join(','),
  Fear2_KindId: [StatusEffectTypeId.Fear2].join(','),
  IncreasePoisoning_KindId: [StatusEffectTypeId.IncreasePoisoning25, StatusEffectTypeId.IncreasePoisoning50].join(','),
  ReduceDamageTaken_KindId: [StatusEffectTypeId.ReduceDamageTaken15, StatusEffectTypeId.ReduceDamageTaken25].join(','),
  CrabShell_KindId: [StatusEffectTypeId.CrabShell].join(','),
  SkyWrath_KindId: [StatusEffectTypeId.SkyWrath].join(','),
  Enrage_KindId: [StatusEffectTypeId.Enrage].join(','),
  BlockPassiveSkills_KindId: [StatusEffectTypeId.BlockPassiveSkills].join(','),
  StatusBanish_KindId: [StatusEffectTypeId.StatusBanish].join(','),
  VoidAbyss_KindId: [StatusEffectTypeId.VoidAbyss].join(','),
  ElectricMark_KindId: [StatusEffectTypeId.ElectricMark].join(','),
  Cocoon_KindId: [StatusEffectTypeId.Cocoon].join(','),
  PoisonCloud_KindId: [StatusEffectTypeId.PoisonCloud].join(','),
  SimpleStoneSkin_KindId: [StatusEffectTypeId.SimpleStoneSkin].join(','),
  ReflectiveStoneSkin_KindId: [StatusEffectTypeId.ReflectiveStoneSkin].join(','),
  Petrification_KindId: [StatusEffectTypeId.Petrification].join(','),
  MirrorDamage_KindId: [StatusEffectTypeId.MirrorDamage].join(','),
  BloodRage_KindId: [StatusEffectTypeId.BloodRage].join(','),
  HydraHitCounter_KindId: [StatusEffectTypeId.HydraHitCounter].join(','),
  NewbieDefence_KindId: [StatusEffectTypeId.NewbieDefence].join(','),
  HungerCounter_KindId: [StatusEffectTypeId.HungerCounter].join(','),
  Devoured_KindId: [StatusEffectTypeId.Devoured].join(','),
  Digestion_KindId: [StatusEffectTypeId.Digestion].join(','),
  IncreaseResistance_KindId: [StatusEffectTypeId.IncreaseResistance25, StatusEffectTypeId.IncreaseResistance50].join(
    ','
  ),
  DecreaseResistance_KindId: [StatusEffectTypeId.DecreaseResistance25, StatusEffectTypeId.DecreaseResistance50].join(
    ','
  ),
  BoneShield_KindId: [StatusEffectTypeId.BoneShield20, StatusEffectTypeId.BoneShield30].join(','),
  FireMark_KindId: [StatusEffectTypeId.FireMark].join(','),
  MarkOfMadness_KindId: [StatusEffectTypeId.MarkOfMadness].join(','),
  LightOrbs_KindId: [StatusEffectTypeId.LightOrbs].join(','),
  Polymorph_KindId: [StatusEffectTypeId.Polymorph].join(','),
  Taunt_KindId: [StatusEffectTypeId.Taunt].join(','),
  SleepCounter_KindId: [StatusEffectTypeId.SleepCounter].join(','),
  SoulCounter_KindId: [StatusEffectTypeId.SoulCounter].join(','),
  Enfeeble_KindId: [StatusEffectTypeId.Enfeeble].join(','),
};

export function evalExpression(
  state: BattleState,
  target: ChampionState,
  expression: string,
  vars: ExpressionVars = {}
): number {
  const allVars = { ...constantVars, ...state.turnVariables, ...vars };
  for (const key of ExpressionBuilderVariableNames) {
    const exp = new RegExp(`(?<![\\w\\s])(?:${key})(?![\\w\\s])`, 'g');
    expression = expression.replace(exp, (allVars[ExpressionBuilderVariable[key]] ?? 0).toString());
  }
  for (const key in Constants) {
    const exp = new RegExp(`(?<![\\w\\s])(?:${key})(?![\\w\\s])`, 'g');
    expression = expression.replace(exp, Constants[key] ?? 0);
  }
  for (const key of ExpressionBuilderFunctionNames) {
    const exp = new RegExp(`(?<![\\w\\s])(?:${key})(?![\\w\\s])`, 'g');
    expression = expression.replace(exp, `context.${key}`);
  }
  try {
    // used by eval()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const context = getExpressionContext(state, target);
    // eslint-disable-next-line no-eval
    const fn = eval(`(context) => (${expression})`);
    return fn(context);
  } catch (e) {
    // console.error(`Failed to evaluate expression: ${expression}`);
    return 0;
  }
}
