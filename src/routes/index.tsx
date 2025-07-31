import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-auto w-sm space-y-8 pb-32 text-center">
      <h2 className="text-2xl">Welcome to Celular Automata</h2>
      <p className="text-lg text-muted-foreground">
        A complete tool for creating and simulating any celular automaton your
        imagination can create. Enjoy!
      </p>
    </div>
  );
}
