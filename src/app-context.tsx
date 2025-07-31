import { createContext, type ReactNode, useContext } from "react";

import type { Automaton } from "@/lib/automata.ts";

import { type GetterSetterPair, useLocalStorageState } from "@/lib/extensions";

interface AppContext {
  automata: GetterSetterPair<Automaton[]>;
}

const AppContext = createContext<AppContext | null>(null);

interface AppProviderProps {
  readonly children: ReactNode;
}

export function AppProvider(props: AppProviderProps): ReactNode {
  const [automata, setAutomata] = useLocalStorageState<Automaton[]>(
    [],
    "automata",
  );
  return (
    <AppContext.Provider value={{ automata: [automata, setAutomata] }}>
      {props.children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context) return context;
  throw new Error("useAppContext cannot be used outside AppProvider");
}
