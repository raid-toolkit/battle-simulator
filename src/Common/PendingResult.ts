export interface PendingResult<T> extends Promise<T> {
  cancel(reason?: any): void;
}
