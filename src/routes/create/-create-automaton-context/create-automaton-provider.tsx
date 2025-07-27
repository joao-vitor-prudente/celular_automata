import { type ReactNode, useState } from "react";

import {
  CreateAutomatonContext,
  type CreateAutomatonContextInitialValue,
} from "@/routes/create/-create-automaton-context/create-automaton-context.ts";

interface CreateAutomatonProviderProps {
  children: ReactNode;
}

export function CreateAutomatonProvider(props: CreateAutomatonProviderProps) {
  const [state, setState] = useState<CreateAutomatonContextInitialValue>({
    baseState: null,
    id: null,
    name: null,
    stateNames: null,
    statesData: null,
    transitions: null,
  });

  return (
    <CreateAutomatonContext.Provider value={[state, setState]}>
      {props.children}
    </CreateAutomatonContext.Provider>
  );
}
