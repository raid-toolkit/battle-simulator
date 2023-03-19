export function assert<T>(condition: T | undefined | null, message?: string): asserts condition is T {
  if (!condition) {
    throw new Error(message ? `Assert: ${message}` : 'Assertion error');
  }
}
