import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button.tsx";
import { useAppContext } from "@/contexts/app-context";
import { AutomatonForm } from "@/routes/_automaton-form-provider/-automaton-form";

import { useAutomatonFormContext } from "./-automaton-form/automaton-form-context.tsx";

export const Route = createFileRoute("/_automaton-form-provider/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const [_, setAutomata] = useAppContext().automata;
  const [state] = useAutomatonFormContext();

  return (
    <div className="flex flex-col items-center gap-12 p-8">
      <AutomatonForm lockSlug={true} />
      <Button
        asChild
        className="w-md"
        onClick={() => {
          setAutomata.edit(state);
        }}
      >
        <Link params={{ slug: state.slug }} to="/simulate/$slug">
          Edit
        </Link>
      </Button>
    </div>
  );
}
