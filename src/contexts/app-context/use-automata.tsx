import {
  JSONSerializer,
  type Serializer,
  useLocalStorageState,
} from "@/hooks/use-local-storage-state.ts";
import { Automaton } from "@/lib/automaton";
import { builtins } from "@/lib/builtin-automata.ts";

class AutomataSerializer
  extends JSONSerializer<Automaton[]>
  implements Serializer<Automaton[]>
{
  public deserialize(value: string): Automaton[] {
    return super.deserialize(value).map((a) => Automaton.fromObject(a));
  }

  public serialize(value: Automaton[]): string {
    return super.serialize(value);
  }
}

export function useAutomata() {
  const [automata, setAutomata] = useLocalStorageState<Automaton[]>(
    [],
    "automata",
    new AutomataSerializer(),
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
