import type { Dispatch, SetStateAction } from "react";

export type GetterSetterPair<T> = readonly [T, Dispatch<SetStateAction<T>>];

export type Merge<T, K> = Omit<K, keyof T> & T;
