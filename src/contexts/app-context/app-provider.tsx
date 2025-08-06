import type { ReactNode } from "react";

import { AppContext } from "@/contexts/app-context/app-context.ts";
import { useAutomata } from "@/contexts/app-context/use-automata.tsx";

interface AppProviderProps {
  readonly children: ReactNode;
}

export function AppProvider(props: AppProviderProps): ReactNode {
  const [automata, setAutomata] = useAutomata();
  return (
    <AppContext.Provider value={{ automata: [automata, setAutomata] }}>
      {props.children}
    </AppContext.Provider>
  );
}
