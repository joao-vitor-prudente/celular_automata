import { createContext, type ReactNode, useContext, useState } from "react";

import type { GetterSetterPair } from "@/hooks/use-local-storage-state.ts";

import { Automaton } from "@/lib/automaton";

const AutomatonFormContext = createContext<GetterSetterPair<Automaton> | null>(
  null,
);

interface AutomatonFormProvider {
  readonly children: ReactNode;
  readonly initial?: Automaton;
}

export function AutomatonFormProvider(props: AutomatonFormProvider) {
  const [state, setState] = useState(props.initial ?? Automaton.blank());

  return (
    <AutomatonFormContext.Provider value={[state, setState]}>
      {props.children}
    </AutomatonFormContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAutomatonFormContext() {
  const context = useContext(AutomatonFormContext);
  if (context) return context;
  throw new Error(
    "useAutomatonFormContext should only be used inside AutomatonFormProvider",
  );
}
