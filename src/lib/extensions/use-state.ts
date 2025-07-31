import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export type GetterSetterPair<T> = readonly [T, Dispatch<SetStateAction<T>>];

export function useLocalStorageState<T>(
  initialState: T,
  key: string,
): GetterSetterPair<T> {
  const [state, setState] = useState<T>(() => {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
