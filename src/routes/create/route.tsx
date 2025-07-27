import { createFileRoute, Outlet } from "@tanstack/react-router";

import { CreateAutomatonProvider } from "@/routes/create/-create-automaton-context/create-automaton-provider.tsx";

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CreateAutomatonProvider>
      <Outlet />
    </CreateAutomatonProvider>
  );
}
