import { type Dispatch, type SetStateAction, useState } from "react";

type UseBooleanState = [
  value: boolean,
  setValue: { set: Dispatch<SetStateAction<boolean>>; toggle: () => void },
];

export function useBooleanState(defaultValue: boolean): UseBooleanState {
  const [value, setValue] = useState(defaultValue);

  function toggle() {
    setValue((prev) => !prev);
  }

  return [value, { set: setValue, toggle }] as const;
}
