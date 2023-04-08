export function assert(condition: false, message?: string): never;
export function assert<T>(condition: T | undefined | null, message?: string): asserts condition is T;
export function assert<T>(condition: T | undefined | null, message?: string): asserts condition is T {
  if (!condition) {
    throw new Error(message ? `Assert: ${message}` : 'Assertion error');
  }
}

export function debugAssert<T>(condition: T | undefined | null, message?: string) {
  if (!condition) {
    console.warn(message ? `Assert: ${message}` : 'Assertion error');
  }
}
