import { SimulateTurnsArgs } from '../../Model';

export interface CancelTaskRequest {
  type: 'cancel';
}

export interface TurnSimulationRequest {
  type: 'turn-simulation';
  args: SimulateTurnsArgs;
}

export type ServiceRequest = CancelTaskRequest | TurnSimulationRequest;
