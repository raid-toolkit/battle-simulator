import EventEmitter from 'events';
import { Message, ServiceRequest } from '../Types';

class WorkQueue extends EventEmitter {
  private queue: Message<ServiceRequest>[] = [];

  public cancel(sequence: number) {
    const index = this.queue.findIndex((q) => q.sequence === sequence);
    if (index >= 0) {
      this.queue.splice(index, 1);
    }
    this.emit('cancel', sequence);
  }

  public enqueue(request: Message<ServiceRequest>) {
    this.queue.push(request);
    this.emit('enqueue', request);
  }

  public dequeue() {
    return this.queue.shift();
  }

  public get isEmpty() {
    return this.queue.length === 0;
  }
}

const workQueue = new WorkQueue();

export default workQueue;
