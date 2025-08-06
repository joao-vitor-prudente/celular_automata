import { type Automaton, builtins } from "@/lib/automata.ts";
import { useLocalStorageState } from "@/lib/extensions";

export function useAutomata() {
  const [automata, setAutomata] = useLocalStorageState<Automaton[]>(
    [],
    "automata",
  );

  function get(slug: string): Automaton | undefined {
    return (
      automata.find((a) => a.slug === slug) ??
      builtins.find((a) => a.slug === slug)
    );
  }

  function create(state: Automaton) {
    setAutomata((prev) => {
      if (builtins.find((a) => a.slug === state.slug)) return prev;
      if (prev.find((a) => a.slug === state.slug)) return prev;
      return [...prev, state];
    });
  }

  function edit(state: Automaton) {
    setAutomata((prev) => {
      if (builtins.find((a) => a.slug === state.slug)) return prev;
      return prev.map((a) => (a.slug === state.slug ? state : a));
    });
  }

  return [
    { get, state: automata },
    { create, edit },
  ] as const;
}
