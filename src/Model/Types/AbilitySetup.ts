export interface AbilitySetup {
  index: number;
  skillTypeId: number;
  label: string;
  description?: string;
  priority?: number;
  cooldown: number;
  opener?: boolean;
  /** @deprecated */
  hits?: number;
}
