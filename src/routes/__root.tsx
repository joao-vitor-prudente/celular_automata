import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <main className="h-screen w-screen overflow-y-auto p-8 flex flex-col gap-6">
        <header>
          <h1 className="text-xl">Celular Automata</h1>
        </header>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
