import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create/transitions-step")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/create"!</div>;
}
