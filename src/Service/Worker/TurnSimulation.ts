/* eslint-disable no-restricted-globals */
import { setupBattle, simulateTurns } from '../../Model/SimulateTurns';
import { Message, TurnSimulationRequest, TurnSimulationResponse } from '../Types';
import WorkerService from './WorkerService';

WorkerService.on('turn-simulation', (message: Message<TurnSimulationRequest>) => {
  const {
    sequence,
    message: { args },
  } = message;
  const state = setupBattle(args);
  const turns = simulateTurns(state);
  const response: Message<TurnSimulationResponse> = { sequence, message: { turns } };
  self.postMessage(response);
});
