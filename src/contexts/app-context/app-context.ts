import { createContext } from "react";

import type { useAutomata } from "@/contexts/app-context/use-automata.tsx";

interface AppContext {
  automata: ReturnType<typeof useAutomata>;
}

export const AppContext = createContext<AppContext | null>(null);
