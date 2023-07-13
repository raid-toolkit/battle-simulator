import { DeferredResult, PendingResult } from '../Common';
import type { SimulateTurnsArgs } from '../Model';
import { CancelTaskRequest, Message, ServiceRequest, ServiceResponse, TurnSimulationResponse } from './Types';

class WorkerProxy {
  private requestSequence = 0;
  private promises = new Map<number, DeferredResult>();
  private worker: Worker | undefined;

  private ensureWorker() {
    if (!this.worker) {
      this.worker = new Worker(new URL('./Worker/index.ts', import.meta.url));
      this.worker.onmessage = this.handleMessage;
    }
    return this.worker;
  }

  requestTurnSimulation(args: SimulateTurnsArgs): PendingResult<TurnSimulationResponse> {
    return this.request<TurnSimulationResponse>({ type: 'turn-simulation', args });
  }

  private readonly handleMessage = (ev: MessageEvent<any>) => {
    const { sequence, message } = ev.data;
    const deferred = this.promises.get(sequence);
    if (deferred) {
      this.promises.delete(sequence);
      deferred.resolve(message);
    }
  };

  private request<T extends ServiceResponse = ServiceResponse>(request: ServiceRequest): PendingResult<T> {
    const worker = this.ensureWorker();
    const message: Message<ServiceRequest> = {
      sequence: this.requestSequence++,
      message: request,
    };

    const cancelMessage: Message<CancelTaskRequest> = { sequence: message.sequence, message: { type: 'cancel' } };
    const deferred = new DeferredResult<T>(() => {
      this.worker?.postMessage(cancelMessage);
    });

    deferred.finally(() => this.promises.delete(message.sequence));
    this.promises.set(message.sequence, deferred);

    worker.postMessage(message);
    return deferred;
  }
}

export const BackgroundService = new WorkerProxy();
