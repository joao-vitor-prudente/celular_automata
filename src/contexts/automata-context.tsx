import { createContext, type ReactNode, useContext } from "react";

import type { Automaton } from "@/lib/automata.ts";
import type { GetterSetterPair } from "@/lib/extensions/types.ts";

import { useLocalStorageState } from "@/hooks/use-local-storage-state.ts";

type AutomataContext = GetterSetterPair<Record<string, Automaton>>;

const AutomataContext = createContext<AutomataContext | null>(null);

interface AutomataConsumerProps {
  readonly children: (props: AutomataContext) => ReactNode;
}

interface AutomataProviderProps {
  readonly children: ReactNode;
}

export function AutomataConsumer(props: AutomataConsumerProps) {
  return (
    <AutomataContext.Consumer>
      {(value) => {
        if (value === null)
          throw new Error(
            "AutomataConsumer cannot be used outside AutomatProvider",
          );
        return props.children(value);
      }}
    </AutomataContext.Consumer>
  );
}

export function AutomataProvider(props: AutomataProviderProps): ReactNode {
  const [automata, setAutomata] = useLocalStorageState<
    Record<string, Automaton>
  >({}, "automata");
  return (
    <AutomataContext.Provider value={[automata, setAutomata]}>
      {props.children}
    </AutomataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAutomataContext() {
  const context = useContext(AutomataContext);
  if (context) return context;
  throw new Error("useAutomataContext cannot be used outside AutomatProvider");
}
