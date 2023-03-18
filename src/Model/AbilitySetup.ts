export interface AbilitySetup {
  index: number;
  label: string;
  description?: string;
  priority?: number;
  cooldown: number;
  opener?: boolean;
  hits?: number;
}
