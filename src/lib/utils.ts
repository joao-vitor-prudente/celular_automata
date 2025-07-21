import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function matrixCopy<T>(matrix: T[][]): T[][] {
  return matrix.map((row) => [...row]);
}

export function matrixFill<T>(value: T, size: number): T[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => value),
  );
}

export function* matrixIter<T>(
  matrix: T[][],
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
