import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ImmutableMatrix<T> = readonly (readonly T[])[];
export type Matrix<T> = T[][];

export function arrayCount<T extends string>(
  arr: T[],
): Partial<Record<T, number>> {
  return arr.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function intWrap(value: number, lower: number, upper: number): number {
  if (lower > upper)
    throw new Error("Lower bound cannot be greater than upper bound.");
  const rangeSize = upper - lower + 1;
  const normalizedValue = value - lower;
  const wrappedNormalized =
    ((normalizedValue % rangeSize) + rangeSize) % rangeSize;
  return wrappedNormalized + lower;
}

export function matrixCopy<T>(matrix: ImmutableMatrix<T>): Matrix<T> {
  return matrix.map((row) => [...row]);
}

export function matrixFill<T>(value: T, size: number): ImmutableMatrix<T> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => value),
  );
}

export function* matrixIter<T>(
  matrix: ImmutableMatrix<T>,
): Generator<[value: T, i: number, j: number, key: string]> {
  for (const [i, row] of matrix.entries()) {
    for (const [j, cell] of row.entries()) {
      yield [cell, i, j, `(${i.toString()}, ${j.toString()})`];
    }
  }
}

export function objectEntries<T extends object>(
  obj: T,
): [key: keyof T, value: T[keyof T]][] {
  return Object.entries(obj) as [key: keyof T, value: T[keyof T]][];
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function stringCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
