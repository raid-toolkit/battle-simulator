/* eslint-disable no-restricted-globals */
import type { Message, ServiceRequest } from '../Types';
import WorkQueue from './WorkQueue';
import './TurnSimulation';

self.onmessage = ({ data: message }: MessageEvent<Message<ServiceRequest>>) => {
  WorkQueue.enqueue(message);
};
