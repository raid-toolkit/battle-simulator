export interface AbilitySetup {
  index: number;
  skillTypeId: number;
  priority?: number;
  cooldown: number;
  opener?: boolean;

  /** @deprecated */
  label: string;
  /** @deprecated */
  description?: string;
}
