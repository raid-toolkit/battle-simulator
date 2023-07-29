import { StatusEffectTypeId } from '@raid-toolkit/webclient';

function mapImagePaths<T>(basePath: string, fn: (value: T) => string | undefined) {
  return (value: T) => fn(value) && `${basePath}${fn(value)}`;
}

// prettier-ignore
export const statusEffectImage = mapImagePaths('/images/effects/', 
  effect=>{switch (effect) {
    case StatusEffectTypeId.ArtifactSet_Shield: return 'Shield2.png';
    case StatusEffectTypeId.BlockActiveSkills: return 'BlockActiveSkills.png';
    case StatusEffectTypeId.BlockBuffs: return 'BlockBuffs.png';
    case StatusEffectTypeId.BlockDamage: return 'BlockDamage.png';
    case StatusEffectTypeId.BlockDebuff: return 'BlockDebuff.png';
    case StatusEffectTypeId.BlockHeal100p: return 'BlockHeal2.png';
    case StatusEffectTypeId.BlockHeal50p: return 'BlockHeal.png';
    case StatusEffectTypeId.BlockPassiveSkills: return 'BlockPassiveSkills.png';
    case StatusEffectTypeId.BlockRevive: return 'BlockRevive.png';
    case StatusEffectTypeId.Burn: return 'AoEContinuousDamage.png';
    case StatusEffectTypeId.ContinuousDamage025p: return 'ContinuousDamage.png';
    case StatusEffectTypeId.ContinuousDamage5p: return 'ContinuousDamage2.png';
    case StatusEffectTypeId.ContinuousHeal075p: return 'ContinuousHeal.png';
    case StatusEffectTypeId.ContinuousHeal15p: return 'ContinuousHeal2.png';
    case StatusEffectTypeId.Counterattack: return 'StatusCounterAttack.png';
    case StatusEffectTypeId.DecreaseAccuracy25: return 'StatusReduceAccuracy.png';
    case StatusEffectTypeId.DecreaseAccuracy50: return 'StatusReduceAccuracy2.png';
    case StatusEffectTypeId.DecreaseAttack25: return 'StatusReduceAttack.png';
    case StatusEffectTypeId.DecreaseAttack50: return 'StatusReduceAttack2.png';
    case StatusEffectTypeId.DecreaseCriticalChance15: return 'StatusReduceCriticalChance.png';
    case StatusEffectTypeId.DecreaseCriticalChance30: return 'StatusReduceCriticalChance2.png';
    case StatusEffectTypeId.DecreaseCriticalDamage15p: return 'StatusReduceCriticalDamage.png';
    case StatusEffectTypeId.DecreaseCriticalDamage25p: return 'StatusReduceCriticalDamage2.png';
    case StatusEffectTypeId.DecreaseDefence30: return 'StatusReduceDefense.png';
    case StatusEffectTypeId.DecreaseDefence60: return 'StatusReduceDefense2.png';
    case StatusEffectTypeId.DecreaseSpeed15: return 'StatusReduceSpeed.png';
    case StatusEffectTypeId.DecreaseSpeed30: return 'StatusReduceSpeed2.png';
    case StatusEffectTypeId.Enrage: return 'Enrage.png';
    case StatusEffectTypeId.Fear1: return 'Fear.png';
    case StatusEffectTypeId.Fear2: return 'Fear2.png';
    case StatusEffectTypeId.Freeze: return 'Freeze.png';
    case StatusEffectTypeId.HitCounterShield: return 'PoisonCloud.png'; // TODO: Get better icon
    case StatusEffectTypeId.IncreaseAccuracy25: return 'StatusIncreaseAccuracy.png';
    case StatusEffectTypeId.IncreaseAccuracy50: return 'StatusIncreaseAccuracy2.png';
    case StatusEffectTypeId.IncreaseAttack25: return 'StatusIncreaseAttack.png';
    case StatusEffectTypeId.IncreaseAttack50: return 'StatusIncreaseAttack2.png';
    case StatusEffectTypeId.IncreaseCriticalChance15: return 'StatusIncreaseCriticalChance.png';
    case StatusEffectTypeId.IncreaseCriticalChance30: return 'StatusIncreaseCriticalChance2.png';
    case StatusEffectTypeId.IncreaseCriticalDamage15: return 'StatusIncreaseCriticalDamage.png';
    case StatusEffectTypeId.IncreaseCriticalDamage30: return 'StatusIncreaseCriticalDamage2.png';
    case StatusEffectTypeId.IncreaseDefence30: return 'StatusIncreaseDefence.png';
    case StatusEffectTypeId.IncreaseDefence60: return 'StatusIncreaseDefence2.png';
    case StatusEffectTypeId.IncreaseDamageTaken15: return 'IncreaseDamageTaken.png';
    case StatusEffectTypeId.IncreaseDamageTaken25: return 'IncreaseDamageTaken2.png';
    case StatusEffectTypeId.IncreasePoisoning25: return 'IncreasePoisoning.png';
    case StatusEffectTypeId.IncreasePoisoning50: return 'IncreasePoisoning2.png';
    case StatusEffectTypeId.IncreaseSpeed15: return 'StatusIncreaseSpeed.png';
    case StatusEffectTypeId.IncreaseSpeed30: return 'StatusIncreaseSpeed2.png';
    case StatusEffectTypeId.Invisible1: return 'Invisible.png';
    case StatusEffectTypeId.Invisible2: return 'Invisible2.png';
    case StatusEffectTypeId.LifeDrainOnDamage10p: return 'LifeDrainOnDamage.png';
    case StatusEffectTypeId.Mark: return 'Mark.png';
    case StatusEffectTypeId.MinotaurIncreaseDamage: return 'MinotaurIncreasdeDamage.png';
    case StatusEffectTypeId.MinotaurIncreaseDamageTaken: return 'MinotaurIncreasdeDamageTaken.png';
    case StatusEffectTypeId.Provoke: return 'Provoke.png';
    case StatusEffectTypeId.ReduceDamageTaken15: return 'ReduceDamageTaken.png';
    case StatusEffectTypeId.ReduceDamageTaken25: return 'ReduceDamageTaken2.png';
    case StatusEffectTypeId.ReflectDamage15: return 'ReflectDamage.png';
    case StatusEffectTypeId.ReflectDamage30: return 'ReflectDamage2.png';
    case StatusEffectTypeId.ReviveOnDeath: return 'ReviveOnDeath.png';
    case StatusEffectTypeId.ShareDamage25: return 'ShareDamage.png';
    case StatusEffectTypeId.ShareDamage50: return 'ShareDamage2.png';
    case StatusEffectTypeId.Shield: return 'Shield.png';
    case StatusEffectTypeId.SkyWrath: return 'BloodRage.png';
    case StatusEffectTypeId.Sleep: return 'Sleep.png';
    case StatusEffectTypeId.Stun: return 'Stun.png';
    case StatusEffectTypeId.TimeBomb: return 'TimeBomb.png';
    case StatusEffectTypeId.Unkillable: return 'Unkillable.png';
    
    case StatusEffectTypeId.StatusBanish:
    case StatusEffectTypeId.VoidAbyss:
    case StatusEffectTypeId.DamageCounter:
    case StatusEffectTypeId.CritShield100:
    case StatusEffectTypeId.CritShield25:
    case StatusEffectTypeId.CritShield50:
    case StatusEffectTypeId.CritShield75:
    case StatusEffectTypeId.CrabShell:
    default:
      return 'Status_Effect_Temp.png';
  }
});
