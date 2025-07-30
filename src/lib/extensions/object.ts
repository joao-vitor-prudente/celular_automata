export function objectEntries<T extends object>(
  obj: T,
): [key: keyof T, value: T[keyof T]][] {
  return Object.entries(obj) as [key: keyof T, value: T[keyof T]][];
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function objectRemoveKey<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  return Object.fromEntries(
    objectEntries(obj).filter(([k]) => k !== key),
  ) as Omit<T, K>;
}

export function objectValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}
