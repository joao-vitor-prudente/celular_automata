import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { useAppContext } from "@/app-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { builtins } from "@/lib/automata.ts";
import { objectEntries } from "@/lib/extensions";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const currentRoute = useLocation();
  const [automata] = useAppContext().automata;
  return (
    <>
      <main className="h-screen w-screen overflow-y-auto flex flex-col">
        <header className="w-full flex gap-6 items-center bg-card p-8 border-b">
          <Link to="/">
            <h1 className="text-xl whitespace-nowrap">Celular Automata</h1>
          </Link>
          <nav className="w-full">
            <ul className="flex gap-2 w-full">
              {objectEntries(builtins).map(([slug, automaton]) => (
                <li key={slug}>
                  <Button
                    aria-disabled={currentRoute.href === `/simulate/${slug}`}
                    asChild
                    variant="link"
                  >
                    <Link params={{ slug }} to="/simulate/$slug">
                      {automaton.name}
                    </Link>
                  </Button>
                </li>
              ))}
              <div className="w-[2px] bg-muted" />
              {objectEntries(automata).map(([slug, automaton]) => (
                <li key={slug}>
                  <Button
                    aria-disabled={currentRoute.href === `/simulate/${slug}`}
                    asChild
                    variant="link"
                  >
                    <Link params={{ slug }} to="/simulate/$slug">
                      {automaton.name}
                    </Link>
                  </Button>
                </li>
              ))}
              <li className="ml-auto">
                <Button
                  aria-disabled={currentRoute.href === "/create"}
                  asChild
                  variant="outline"
                >
                  <Link to="/create">Create Automaton</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
