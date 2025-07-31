import { createFileRoute } from "@tanstack/react-router";

import { useAppContext } from "@/app-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { builtins } from "@/lib/automata.ts";
import { AutomatonForm } from "@/routes/_automaton-form-provider/-automaton-form";

import { useAutomatonFormContext } from "./-automaton-form/automaton-form-context.tsx";

export const Route = createFileRoute("/_automaton-form-provider/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const [_, setAutomata] = useAppContext().automata;
  const [state] = useAutomatonFormContext();

  function saveAutomaton() {
    if (state.slug in builtins) return;
    setAutomata((prev) => ({ ...prev, [state.slug]: state }));
  }

  return (
    <div className="p-8 flex flex-col items-center gap-12">
      <AutomatonForm lockSlug={true} />
      <Button className="w-md" onClick={saveAutomaton}>
        Edit
      </Button>
    </div>
  );
}
