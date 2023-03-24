export interface AbilitySetup {
  index: number;
  skillTypeId: number;
  /** @deprecated */
  label: string;
  /** @deprecated */
  description?: string;
  priority?: number;
  cooldown: number;
  opener?: boolean;
  /** @deprecated */
  hits?: number;
}
