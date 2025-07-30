export function arrayCount<T extends string>(
  arr: T[],
): Partial<Record<T, number>> {
  return arr.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

export function arrayEquals<T>(array1: T[], array2: T[]): boolean {
  return (
    array1.length === array2.length &&
    array1.every((item, index) => item === array2[index])
  );
}

export function arrayRemoveAt<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function arraySum(array: number[]): number {
  return array.reduce((acc, cur) => acc + cur, 0);
}

export function arrayToRecord<T extends PropertyKey, K>(
  arr: T[],
  fillValue: K,
): Record<T, K> {
  const res = arr.reduce<Partial<Record<T, K>>>((acc, cur) => {
    acc[cur] = fillValue;
    return acc;
  }, {});
  return res as Record<T, K>;
}
