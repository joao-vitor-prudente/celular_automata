import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export type GetterSetterPair<T> = readonly [T, Dispatch<SetStateAction<T>>];

export interface Serializer<T> {
  deserialize(value: string): T;
  serialize(value: T): string;
}

export class JSONSerializer<T> implements Serializer<T> {
  public deserialize(value: string): T {
    return JSON.parse(value) as T;
  }

  public serialize(value: T): string {
    return JSON.stringify(value);
  }
}

export function useLocalStorageState<T>(
  initialState: T,
  key: string,
  serializer: Serializer<T> = new JSONSerializer(),
): GetterSetterPair<T> {
  const [state, setState] = useState<T>(() => {
    const value = localStorage.getItem(key);
    return value ? serializer.deserialize(value) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, serializer.serialize(state));
  }, [state]);

  return [state, setState];
}
