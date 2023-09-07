import type { SimulatorConfigDefinition, StageBuilder } from './Types';
import { FireknightConfig } from './Configuration.FireKnight';
import { HydraConfig } from './Configuration.Hydra';

export const SimulatorConfigurations: Record<string, SimulatorConfigDefinition> = {
  dungeons: FireknightConfig,
  hydra: HydraConfig,
};

export const StageBuilderByStage: Record<number, StageBuilder> = {
  ...SimulatorConfigurations.dungeons.stages,
  ...SimulatorConfigurations.hydra.stages,
};

export const StageLookup: { label: string; stage: number; region: string; area: string }[] = [
  { label: 'Stage 1', stage: 2082001, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 2', stage: 2082002, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 3', stage: 2082003, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 4', stage: 2082004, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 5', stage: 2082005, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 6', stage: 2082006, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 7', stage: 2082007, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 8', stage: 2082008, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 9', stage: 2082009, region: 'fireknight', area: 'dungeons' },
  { label: 'Stage 10', stage: 2082010, region: 'fireknight', area: 'dungeons' },
  { label: 'Normal', stage: 8019001, region: 'rotation1', area: 'hydra' },
  { label: 'Normal', stage: 8029001, region: 'rotation2', area: 'hydra' },
  { label: 'Normal', stage: 8039001, region: 'rotation3', area: 'hydra' },
  { label: 'Normal', stage: 8049001, region: 'rotation4', area: 'hydra' },
  { label: 'Normal', stage: 8059001, region: 'rotation5', area: 'hydra' },
  { label: 'Normal', stage: 8069001, region: 'rotation6', area: 'hydra' },
  { label: 'Hard', stage: 8019002, region: 'rotation1', area: 'hydra' },
  { label: 'Hard', stage: 8029002, region: 'rotation2', area: 'hydra' },
  { label: 'Hard', stage: 8039002, region: 'rotation3', area: 'hydra' },
  { label: 'Hard', stage: 8049002, region: 'rotation4', area: 'hydra' },
  { label: 'Hard', stage: 8059002, region: 'rotation5', area: 'hydra' },
  { label: 'Hard', stage: 8069002, region: 'rotation6', area: 'hydra' },
  { label: 'Brutal', stage: 8019003, region: 'rotation1', area: 'hydra' },
  { label: 'Brutal', stage: 8029003, region: 'rotation2', area: 'hydra' },
  { label: 'Brutal', stage: 8039003, region: 'rotation3', area: 'hydra' },
  { label: 'Brutal', stage: 8049003, region: 'rotation4', area: 'hydra' },
  { label: 'Brutal', stage: 8059003, region: 'rotation5', area: 'hydra' },
  { label: 'Brutal', stage: 8069003, region: 'rotation6', area: 'hydra' },
  { label: 'Nightmare', stage: 8019004, region: 'rotation1', area: 'hydra' },
  { label: 'Nightmare', stage: 8029004, region: 'rotation2', area: 'hydra' },
  { label: 'Nightmare', stage: 8039004, region: 'rotation3', area: 'hydra' },
  { label: 'Nightmare', stage: 8049004, region: 'rotation4', area: 'hydra' },
  { label: 'Nightmare', stage: 8059004, region: 'rotation5', area: 'hydra' },
  { label: 'Nightmare', stage: 8069004, region: 'rotation6', area: 'hydra' },
];
