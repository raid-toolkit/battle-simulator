export interface Message<T> {
  sequence: number;
  message: T;
}
