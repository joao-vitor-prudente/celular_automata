import { useStore } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clipboard, Pencil } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { useAppContext } from "@/app-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAppForm } from "@/components/ui/form.tsx";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { builtins } from "@/lib/automata.ts";
import { objectKeys, stringCapitalize } from "@/lib/extensions";

import { Board } from "./-board";
import { useBoard } from "./-use-board.ts";

export const Route = createFileRoute("/simulate/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const [automata] = useAppContext().automata;
  const automaton =
    builtins.find((a) => a.slug === slug) ??
    automata.find((a) => a.slug === slug);
  if (!automaton) throw new Error("No automaton found for given slug.");

  const form = useAppForm({
    defaultValues: { fps: 5, stateBrush: automaton.baseState },
    validators: {
      onChange: z.object({ fps: z.number(), stateBrush: z.string() }),
    },
  });
  const formValues = useStore(form.store, (state) => state.values);
  const board = useBoard(32, automaton);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 p-8">
      <header className="col-span-2 flex items-center gap-2">
        <h3 className="text-2xl">{automaton.name}</h3>
        <nav>
          <ul className="flex">
            <li hidden={!!builtins.find((a) => a.slug === slug)}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild className="size-5" variant="ghost">
                    <Link search={{ slug: automaton.slug }} to="/edit">
                      <Pencil />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Automaton</TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild className="size-5" variant="ghost">
                    <Link search={{ slug: automaton.slug }} to="/create">
                      <Clipboard />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Automaton</TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </nav>
      </header>
      <Board
        automaton={automaton}
        board={board}
        fps={formValues.fps}
        isRunning={isRunning}
        stateBrush={formValues.stateBrush}
      />
      <section className="flex max-w-sm flex-col gap-4">
        <header>
          <h4 className="text-lg">Simulation Configuration</h4>
        </header>
        <form.AppForm>
          <form.AppField name="stateBrush">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>State Brush</field.FormLabel>
                <field.FormControl>
                  <field.Select>
                    <field.SelectTrigger className="w-full">
                      <SelectValue placeholder="State" />
                    </field.SelectTrigger>
                    <SelectContent>
                      {objectKeys(automaton.states).map((state) => (
                        <SelectItem key={state} value={state}>
                          {stringCapitalize(state)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </field.Select>
                </field.FormControl>
                <field.FormDescription>
                  The state to paint the initial configuration of the board
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
          <form.AppField name="fps">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>FPS</field.FormLabel>
                <field.FormControl>
                  <field.Input type="number" />
                </field.FormControl>
                <field.FormDescription>
                  Number of steps computed each second
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
        </form.AppForm>
        <Button
          onClick={() => {
            setIsRunning((prev) => !prev);
          }}
        >
          {isRunning ? "Stop Automaton" : "Start Automaton"}
        </Button>
        <div className="flex gap-2">
          <Button
            className="grow"
            disabled={isRunning}
            onClick={board.advance}
            variant="secondary"
          >
            Advance Automaton
          </Button>
          <Button
            className="grow"
            disabled={isRunning}
            onClick={board.clear}
            variant="destructive"
          >
            Clear Board
          </Button>
        </div>
      </section>
    </div>
  );
}
