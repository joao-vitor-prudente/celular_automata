export function arrayCount<T extends string>(
  arr: T[],
): Partial<Record<T, number>> {
  return arr.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}
