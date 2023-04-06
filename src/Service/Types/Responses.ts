import { BattleTurn } from '../../Model';

export interface TurnSimulationResponse {
  turns: BattleTurn[];
  duration: number;
}

export type ServiceResponse = TurnSimulationResponse;
