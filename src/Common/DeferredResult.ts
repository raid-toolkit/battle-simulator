import { Deferred } from 'ts-deferred';
import { PendingResult } from './PendingResult';

export class DeferredResult<T = any> implements PendingResult<T> {
  private readonly deferred = new Deferred<T>();
  private cancelled = false;

  constructor(private onCancel?: () => void) {}

  resolve(value: T) {
    if (this.cancelled) return;
    this.deferred.resolve(value);
  }

  reject(reason: any) {
    if (this.cancelled) return;
    this.deferred.reject(reason);
  }

  cancel(reason: any) {
    this.cancelled = true;
    this.deferred.reject(reason);

    this.onCancel?.();
    delete this.onCancel;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
  ): Promise<TResult1 | TResult2> {
    return this.deferred.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined
  ): Promise<T | TResult> {
    return this.deferred.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    return this.deferred.promise.finally(onfinally);
  }

  get [Symbol.toStringTag]() {
    return this.deferred.promise[Symbol.toStringTag];
  }
}
