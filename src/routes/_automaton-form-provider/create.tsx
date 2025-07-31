import { createFileRoute } from "@tanstack/react-router";

import { useAppContext } from "@/app-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { builtins } from "@/lib/automata.ts";
import { AutomatonForm } from "@/routes/_automaton-form-provider/-automaton-form";

import { useAutomatonFormContext } from "./-automaton-form/automaton-form-context.tsx";

export const Route = createFileRoute("/_automaton-form-provider/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [automata, setAutomata] = useAppContext().automata;
  const [state] = useAutomatonFormContext();

  function saveAutomaton() {
    if (builtins.find((a) => a.slug === state.slug)) return;
    if (automata.find((a) => a.slug === state.slug)) return;
    setAutomata((prev) => [...prev, state]);
  }

  return (
    <div className="flex flex-col items-center gap-12 p-8">
      <AutomatonForm />
      <Button className="w-md" onClick={saveAutomaton}>
        Create
      </Button>
    </div>
  );
}
