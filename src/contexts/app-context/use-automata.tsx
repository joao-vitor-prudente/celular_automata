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

  function isBuiltin(slug: string): boolean {
    return !!builtins.find((a) => a.slug === slug);
  }

  function create(automaton: Automaton) {
    setAutomata((prev) => {
      if (builtins.find((a) => a.slug === automaton.slug)) return prev;
      if (prev.find((a) => a.slug === automaton.slug)) return prev;
      return [...prev, automaton];
    });
  }

  function edit(automaton: Automaton) {
    setAutomata((prev) => {
      if (builtins.find((a) => a.slug === automaton.slug)) return prev;
      return prev.map((a) => (a.slug === automaton.slug ? automaton : a));
    });
  }

  function remove(slug: string) {
    setAutomata((prev) => prev.filter((a) => a.slug !== slug));
  }

  return [
    { get, isBuiltin, state: automata },
    { create, edit, remove },
  ] as const;
}
