import { EventEmitter } from 'events';
import WorkQueue from './WorkQueue';

const idle = 10;

class WorkerService extends EventEmitter {
  private timeoutHandle?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    WorkQueue.on('enqueue', this.startIfStopped);
  }

  private startIfStopped = () => {
    if (this.timeoutHandle) {
      return;
    }
    this.timeoutHandle = setTimeout(this.processNext, 0);
  };

  private processNext = () => {
    const request = WorkQueue.dequeue();

    if (!request) {
      this.timeoutHandle = undefined;
      return;
    }

    if (WorkQueue.isEmpty) {
      delete this.timeoutHandle;
    } else {
      this.timeoutHandle = setTimeout(this.processNext, idle);
    }

    this.emit(request.message.type, request);
  };
}

const workerService = new WorkerService();

export default workerService;
