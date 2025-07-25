import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Board } from "@/components/board";
import { useBoard } from "@/components/board/use-board.ts";
import { Button } from "@/components/ui/button.tsx";
import { useAppForm } from "@/components/ui/form.tsx";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useBooleanState } from "@/hooks/useBooleanState.ts";
import { builtins } from "@/lib/automata.ts";
import { objectKeys, stringCapitalize } from "@/lib/extensions";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const automaton = builtins.conwaysGameOfLife;
  const form = useAppForm({
    defaultValues: { fps: 5, stateBrush: automaton.baseState },
    validators: {
      onChange: z.object({ fps: z.number(), stateBrush: z.string() }),
    },
  });
  const formValues = useStore(form.store, (state) => state.values);
  const board = useBoard(32, automaton);
  const [isRunning, setIsRunning] = useBooleanState(false);

  return (
    <main className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr] p-8 gap-6">
      <header className="col-span-2">
        <h1 className="text-xl">Celular Automata</h1>
      </header>
      <div className="row-span-2">
        <Board
          automaton={automaton}
          board={board}
          fps={formValues.fps}
          isRunning={isRunning}
          stateBrush={formValues.stateBrush}
        />
      </div>
      <section className="max-w-sm flex flex-col gap-4">
        <header>
          <h4 className="text-lg">Simulation Configuration</h4>
        </header>
        <form.AppForm>
          <form.AppField name="stateBrush">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Username</field.FormLabel>
                <field.FormControl>
                  <field.Select>
                    <field.SelectTrigger>
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
                <field.FormLabel>Username</field.FormLabel>
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
        <Button onClick={setIsRunning.toggle}>
          {isRunning ? "Stop Automaton" : "Start Automaton"}
        </Button>
        <Button disabled={isRunning} onClick={board.advance}>
          Advance Automaton
        </Button>
        <Button disabled={isRunning} onClick={board.clear}>
          Clear Board
        </Button>
      </section>
    </main>
  );
}
