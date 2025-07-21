export function intWrap(value: number, lower: number, upper: number): number {
  if (lower > upper)
    throw new Error("Lower bound cannot be greater than upper bound.");
  const rangeSize = upper - lower + 1;
  const normalizedValue = value - lower;
  const wrappedNormalized =
    ((normalizedValue % rangeSize) + rangeSize) % rangeSize;
  return wrappedNormalized + lower;
}
