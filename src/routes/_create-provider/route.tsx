import { createFileRoute, Outlet } from "@tanstack/react-router";

import { CreateAutomatonProvider } from "@/routes/_create-provider/-create-automaton-context.tsx";

export const Route = createFileRoute("/_create-provider")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CreateAutomatonProvider>
      <Outlet />
    </CreateAutomatonProvider>
  );
}
