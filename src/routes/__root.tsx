import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

import { Button } from "@/components/ui/button.tsx";
import { builtins } from "@/lib/automata.ts";
import { objectEntries } from "@/lib/extensions";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <main className="h-screen w-screen overflow-y-auto flex flex-col gap-6">
        <header className="w-full flex gap-6 items-center bg-card p-8 border-b">
          <Link to="/">
            <h1 className="text-xl whitespace-nowrap">Celular Automata</h1>
          </Link>
          <nav className="w-full">
            <ul className="flex gap-2 w-full">
              {objectEntries(builtins).map(([automatonId, automaton]) => (
                <li>
                  <Button asChild variant="link">
                    <Link params={{ automatonId }} to="/simulate/$automatonId">
                      {automaton.name}
                    </Link>
                  </Button>
                </li>
              ))}

              <li className="ml-auto">
                <Button asChild variant="outline">
                  <Link
                    params={{ automatonId: "conwaysGameOfLife" }}
                    to="/create"
                  >
                    Create Automaton
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
