import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create/states-step")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/create"!</div>;
}
