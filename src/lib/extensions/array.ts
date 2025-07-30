export function arrayCount<T extends string>(
  arr: T[],
): Partial<Record<T, number>> {
  return arr.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
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
