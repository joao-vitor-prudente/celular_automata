import { createContext, type ReactNode, useContext } from "react";

import { useCreateAutomaton } from "./create/-use-create-automaton.ts";

const CreateAutomatonContext = createContext<null | ReturnType<
  typeof useCreateAutomaton
>>(null);

interface CreateAutomatonProvider {
  readonly children: ReactNode;
}

export function CreateAutomatonProvider(props: CreateAutomatonProvider) {
  const [state, setState] = useCreateAutomaton();

  return (
    <CreateAutomatonContext.Provider value={[state, setState]}>
      {props.children}
    </CreateAutomatonContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateAutomatonContext() {
  const context = useContext(CreateAutomatonContext);
  if (context) return context;
  throw new Error(
    "useCreateAutomatonContext should only be used inside CreateAutomatonProvider",
  );
}
