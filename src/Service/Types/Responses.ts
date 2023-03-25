import { BattleTurn } from '../../Model';

export interface TurnSimulationResponse {
  turns: BattleTurn[];
}

export type ServiceResponse = TurnSimulationResponse;
