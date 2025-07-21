export function objectEntries<T extends object>(
  obj: T,
): [key: keyof T, value: T[keyof T]][] {
  return Object.entries(obj) as [key: keyof T, value: T[keyof T]][];
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
