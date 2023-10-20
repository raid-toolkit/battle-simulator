import { StatusEffectTypeId } from '@raid-toolkit/webclient';
import React from 'react';

// TODO: update to include new buffs/debuffs
const effectKindToIcon: Record<StatusEffectTypeId, string> = {
  [StatusEffectTypeId.ArtifactSet_Shield]: 'Shield2',
  [StatusEffectTypeId.BlockActiveSkills]: 'BlockActiveSkills',
  [StatusEffectTypeId.BlockBuffs]: 'BlockBuffs',
  [StatusEffectTypeId.BlockDamage]: 'BlockDamage',
  [StatusEffectTypeId.BlockDebuff]: 'BlockDebuff',
  [StatusEffectTypeId.BlockHeal100p]: 'BlockHeal2',
  [StatusEffectTypeId.BlockHeal50p]: 'BlockHeal',
  [StatusEffectTypeId.BlockPassiveSkills]: 'BlockPassiveSkills',
  [StatusEffectTypeId.BlockRevive]: 'BlockRevive',
  [StatusEffectTypeId.Burn]: 'AoEContinuousDamage',
  [StatusEffectTypeId.ContinuousDamage025p]: 'ContinuousDamage',
  [StatusEffectTypeId.ContinuousDamage5p]: 'ContinuousDamage2',
  [StatusEffectTypeId.ContinuousHeal075p]: 'ContinuousHeal',
  [StatusEffectTypeId.ContinuousHeal15p]: 'ContinuousHeal2',
  [StatusEffectTypeId.Counterattack]: 'StatusCounterAttack',
  [StatusEffectTypeId.CrabShell]: 'Cocoon', // temp
  [StatusEffectTypeId.CritShield100]: 'Cocoon', // temp
  [StatusEffectTypeId.CritShield25]: 'Cocoon', // temp
  [StatusEffectTypeId.CritShield50]: 'Cocoon', // temp
  [StatusEffectTypeId.CritShield75]: 'Cocoon', // temp
  [StatusEffectTypeId.DamageCounter]: '', // temp
  [StatusEffectTypeId.DecreaseAccuracy25]: 'StatusReduceAccuracy',
  [StatusEffectTypeId.DecreaseAccuracy50]: 'StatusReduceAccuracy2',
  [StatusEffectTypeId.DecreaseAttack25]: 'StatusReduceAttack',
  [StatusEffectTypeId.DecreaseAttack50]: 'StatusReduceAttack2',
  [StatusEffectTypeId.DecreaseCriticalChance15]: 'StatusReduceCriticalChance',
  [StatusEffectTypeId.DecreaseCriticalChance30]: 'StatusReduceCriticalChance2',
  [StatusEffectTypeId.DecreaseCriticalDamage15p]: 'StatusReduceCriticalDamage',
  [StatusEffectTypeId.DecreaseCriticalDamage25p]: 'StatusReduceCriticalDamage2',
  [StatusEffectTypeId.DecreaseDefence30]: 'StatusReduceDefence',
  [StatusEffectTypeId.DecreaseDefence60]: 'StatusReduceDefence2',
  [StatusEffectTypeId.DecreaseSpeed15]: 'StatusReduceSpeed',
  [StatusEffectTypeId.DecreaseSpeed30]: 'StatusReduceSpeed2',
  [StatusEffectTypeId.Enrage]: 'BloodRage',
  [StatusEffectTypeId.Fear1]: 'Fear',
  [StatusEffectTypeId.Fear2]: 'Fear2',
  [StatusEffectTypeId.Freeze]: 'Freeze',
  [StatusEffectTypeId.HitCounterShield]: '', // temp
  [StatusEffectTypeId.IncreaseAccuracy25]: 'StatusIncreaseAccuracy',
  [StatusEffectTypeId.IncreaseAccuracy50]: 'StatusIncreaseAccuracy2',
  [StatusEffectTypeId.IncreaseAttack25]: 'StatusIncreaseAttack',
  [StatusEffectTypeId.IncreaseAttack50]: 'StatusIncreaseAttack2',
  [StatusEffectTypeId.IncreaseCriticalChance15]: 'StatusIncreaseCriticalChance',
  [StatusEffectTypeId.IncreaseCriticalChance30]: 'StatusIncreaseCriticalChance2',
  [StatusEffectTypeId.IncreaseCriticalDamage15]: 'StatusIncreaseCriticalDamage',
  [StatusEffectTypeId.IncreaseCriticalDamage30]: 'StatusIncreaseCriticalDamage2',
  [StatusEffectTypeId.IncreaseDamageTaken15]: 'IncreaseDamageTaken',
  [StatusEffectTypeId.IncreaseDamageTaken25]: 'IncreaseDamageTaken2',
  [StatusEffectTypeId.IncreaseDefence30]: 'StatusIncreaseDefence',
  [StatusEffectTypeId.IncreaseDefence60]: 'StatusIncreaseDefence2',
  [StatusEffectTypeId.IncreasePoisoning25]: 'IncreasePoisoning',
  [StatusEffectTypeId.IncreasePoisoning50]: 'IncreasePoisoning2',
  [StatusEffectTypeId.IncreaseSpeed15]: 'StatusIncreaseSpeed',
  [StatusEffectTypeId.IncreaseSpeed30]: 'StatusIncreaseSpeed2',
  [StatusEffectTypeId.Invisible1]: 'Invisible',
  [StatusEffectTypeId.Invisible2]: 'Invisible2',
  [StatusEffectTypeId.LifeDrainOnDamage10p]: 'LifeDrainOnDamage',
  [StatusEffectTypeId.Mark]: 'Mark',
  [StatusEffectTypeId.MinotaurIncreaseDamage]: 'MinotaurIncreaseDamage',
  [StatusEffectTypeId.MinotaurIncreaseDamageTaken]: 'MinotaurIncreaseDamageTaken',
  [StatusEffectTypeId.HydraNeckIncreaseDamageTaken]: 'HydraNeckIncreaseDamageTaken',
  [StatusEffectTypeId.Provoke]: 'Provoke',
  [StatusEffectTypeId.ReduceDamageTaken15]: 'ReduceDamageTaken',
  [StatusEffectTypeId.ReduceDamageTaken25]: 'ReduceDamageTaken2',
  [StatusEffectTypeId.ReflectDamage15]: 'ReflectDamage',
  [StatusEffectTypeId.ReflectDamage30]: 'ReflectDamage2',
  [StatusEffectTypeId.ReviveOnDeath]: 'ReviveOnDeath',
  [StatusEffectTypeId.ShareDamage25]: 'ShareDamage',
  [StatusEffectTypeId.ShareDamage50]: 'ShareDamage2',
  [StatusEffectTypeId.Shield]: 'Shield',
  [StatusEffectTypeId.SkyWrath]: 'Enrage',
  [StatusEffectTypeId.Sleep]: 'Sleep',
  [StatusEffectTypeId.StatusBanish]: '',
  [StatusEffectTypeId.Stun]: 'Stun',
  [StatusEffectTypeId.TimeBomb]: 'TimeBomb',
  [StatusEffectTypeId.Unkillable]: 'Unkillable',
  [StatusEffectTypeId.VoidAbyss]: '',
  [StatusEffectTypeId.ElectricMark]: 'ElectricMark',
  [StatusEffectTypeId.Cocoon]: 'Cocoon',
  [StatusEffectTypeId.PoisonCloud]: 'PoisonCloud',
  [StatusEffectTypeId.SimpleStoneSkin]: 'StoneSkin',
  [StatusEffectTypeId.ReflectiveStoneSkin]: 'StoneSkin',
  [StatusEffectTypeId.Petrification]: 'Petrification',
  [StatusEffectTypeId.MirrorDamage]: 'MirrorDamage',
  [StatusEffectTypeId.BloodRage]: 'BloodRage',
  [StatusEffectTypeId.HydraHitCounter]: 'HydraHitCounter',
  [StatusEffectTypeId.NewbieDefence]: 'NewbieDefence',
  [StatusEffectTypeId.HungerCounter]: 'HungerCounter',
  [StatusEffectTypeId.Devoured]: 'Status_Effect_Temp',
  [StatusEffectTypeId.Digestion]: 'Digestion',
  [StatusEffectTypeId.IncreaseResistance25]: 'StatusIncreaseResistance',
  [StatusEffectTypeId.IncreaseResistance50]: 'StatusIncreaseResistance2',
  [StatusEffectTypeId.DecreaseResistance25]: 'StatusReduceResistance',
  [StatusEffectTypeId.DecreaseResistance50]: 'StatusReduceResistance2',
  [StatusEffectTypeId.BoneShield20]: 'BoneShield',
  [StatusEffectTypeId.BoneShield30]: 'BoneShield',
  [StatusEffectTypeId.FireMark]: 'FireMark',
  [StatusEffectTypeId.MarkOfMadness]: 'MarkOfMadness',
  [StatusEffectTypeId.LightOrbs]: 'LightOrbs',
  [StatusEffectTypeId.Polymorph]: 'Polymorph',
  [StatusEffectTypeId.Taunt]: 'Taunt',
  [StatusEffectTypeId.SleepCounter]: 'Status_Effect_Temp',
  [StatusEffectTypeId.SoulCounter]: 'Status_Effect_Temp',
  [StatusEffectTypeId.Enfeeble]: 'Enfeeble',
};

export interface StatusEffectIconProps {
  typeId: StatusEffectTypeId;
  duration: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const StatusEffectIcon: React.FC<StatusEffectIconProps> = ({ typeId, duration, style, width, height }) => {
  const imgStyle = React.useMemo(() => ({ ...style, width, height }), [style, width, height]);
  return effectKindToIcon[typeId] ? (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        color: 'white',
        lineHeight: '1rem',
        fontSize: '1rem',
      }}
    >
      <img
        className="avatar"
        style={imgStyle}
        alt="hero avatar"
        src={`/images/effects/${effectKindToIcon[typeId]}.png`}
      />
      <span
        style={{
          position: 'absolute',
          right: 2,
          bottom: 1,
          WebkitTextStroke: '5px black',
          WebkitTextFillColor: 'white',
        }}
      >
        {duration}
      </span>
      <span
        style={{
          position: 'absolute',
          right: 2,
          bottom: 1,
        }}
      >
        {duration}
      </span>
    </span>
  ) : null;
};
