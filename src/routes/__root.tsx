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

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const currentRoute = useLocation();
  const [automata] = useAppContext().automata;
  return (
    <>
      <main className="flex h-screen w-screen flex-col overflow-y-auto">
        <header className="flex w-full items-center gap-6 border-b bg-card p-8">
          <Link to="/">
            <h1 className="text-xl whitespace-nowrap">Celular Automata</h1>
          </Link>
          <nav className="w-full">
            <ul className="flex w-full gap-2">
              {builtins.map((automaton) => (
                <li key={automaton.slug}>
                  <Button
                    aria-disabled={
                      currentRoute.href === `/simulate/${automaton.slug}`
                    }
                    asChild
                    variant="link"
                  >
                    <Link
                      params={{ slug: automaton.slug }}
                      to="/simulate/$slug"
                    >
                      {automaton.name}
                    </Link>
                  </Button>
                </li>
              ))}
              <div className="w-[2px] bg-muted" />
              {automata.map((automaton) => (
                <li key={automaton.slug}>
                  <Button
                    aria-disabled={
                      currentRoute.href === `/simulate/${automaton.slug}`
                    }
                    asChild
                    variant="link"
                  >
                    <Link
                      params={{ slug: automaton.slug }}
                      to="/simulate/$slug"
                    >
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
