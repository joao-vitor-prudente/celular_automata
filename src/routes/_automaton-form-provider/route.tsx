import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { useAppContext } from "@/app-context.tsx";
import { builtins } from "@/lib/automata.ts";

import { AutomatonFormProvider } from "./-automaton-form";

export const Route = createFileRoute("/_automaton-form-provider")({
  component: RouteComponent,
  validateSearch: z.object({ slug: z.string().optional() }),
});

function RouteComponent() {
  const slug = Route.useSearch().slug;
  const [automata] = useAppContext().automata;
  const automaton = slug
    ? (builtins.find((a) => a.slug === slug) ??
      automata.find((a) => a.slug === slug))
    : undefined;

  return (
    <AutomatonFormProvider initial={automaton}>
      <Outlet />
    </AutomatonFormProvider>
  );
}
