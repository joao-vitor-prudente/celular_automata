import { useContext } from "react";

import { AppContext } from "@/contexts/app-context/app-context.ts";

export function useAppContext() {
  const context = useContext(AppContext);
  if (context) return context;
  throw new Error("useAppContext cannot be used outside AppProvider");
}
