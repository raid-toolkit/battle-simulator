export interface SkillEffectModification {
  // modificiations
  disabledStatusEffectIndexes?: Record<number, boolean>;
  disabled?: boolean;
}

export interface AbilitySetup {
  index: number;
  skillTypeId: number;
  priority?: number;
  cooldown: number;
  effectMods?: Record<number, SkillEffectModification>;
  targetIndex?: number;

  /** @deprecated */
  opener?: boolean;
}
