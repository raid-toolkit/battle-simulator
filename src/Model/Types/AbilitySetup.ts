export interface AbilitySetup {
  index: number;
  skillTypeId: number;
  priority?: number;
  cooldown: number;
  /** @deprecated */
  opener?: boolean;
}
