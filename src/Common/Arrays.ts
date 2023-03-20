export function range(length: number, start: number): number[];
export function range<T>(length: number, getValue: (n: number) => T): T[];
export function range<T>(
  length: number,
  startOrGenerator: number | ((n: number) => T)
): typeof startOrGenerator extends number ? number[] : T[] {
  const mapFn = (
    typeof startOrGenerator === 'function'
      ? (_: unknown, n: number) => startOrGenerator(n)
      : (_: unknown, n: number) => n + startOrGenerator
  ) as (n: number) => T;
  return Array.from({ length }, mapFn);
}

export function replaceItemAtIndex<T>(arr: readonly T[], index: number, newValue: T): readonly T[] {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T>(arr: readonly T[], index: number): readonly T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function shuffle<T>(array: readonly Readonly<T>[]) {
  let currentIndex = array.length,
    randomIndex;
  const result = [...array];

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }

  return result;
}
