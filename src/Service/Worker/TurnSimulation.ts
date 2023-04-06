/* eslint-disable no-restricted-globals */
import { setupBattle, simulateTurns } from '../../Model/SimulateTurns';
import { Message, TurnSimulationRequest, TurnSimulationResponse } from '../Types';
import WorkerService from './WorkerService';

WorkerService.on('turn-simulation', (message: Message<TurnSimulationRequest>) => {
  const {
    sequence,
    message: { args },
  } = message;
  const sw = performance.now();
  const state = setupBattle(args);
  const turns = simulateTurns(state);
  const duration = performance.now() - sw;
  const response: Message<TurnSimulationResponse> = { sequence, message: { turns, duration } };
  self.postMessage(response);
});
