import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-auto pb-32 w-sm text-center space-y-8">
      <h2 className="text-2xl">Welcome to Celular Automata</h2>
      <p className="text-lg text-muted-foreground">
        A complete tool for creating and simulating any celular automaton your
        imagination can create. Enjoy!
      </p>
    </div>
  );
}
