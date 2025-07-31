import { createContext, type ReactNode, useContext } from "react";

import type { Automaton } from "@/lib/automata.ts";

import { useAutomatonForm } from "./use-automaton-form.ts";

const AutomatonFormContext = createContext<null | ReturnType<
  typeof useAutomatonForm
>>(null);

interface AutomatonFormProvider {
  readonly children: ReactNode;
  readonly initial?: Automaton;
}

export function AutomatonFormProvider(props: AutomatonFormProvider) {
  const [state, setState] = useAutomatonForm(props.initial);

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
