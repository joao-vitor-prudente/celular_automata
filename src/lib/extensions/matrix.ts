export type ImmutableMatrix<T> = readonly (readonly T[])[];
export type Matrix<T> = T[][];

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
