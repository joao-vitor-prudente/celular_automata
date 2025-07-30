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
import { useBooleanState } from "@/hooks/use-boolean-state.ts";
import { builtins } from "@/lib/automata.ts";
import { objectKeys, stringCapitalize } from "@/lib/extensions";

export const Route = createFileRoute("/simulate/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const slug = params.slug as keyof typeof builtins;
  const automaton = builtins[slug];
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
    <div className="flex gap-6 p-8">
      <Board
        automaton={automaton}
        board={board}
        fps={formValues.fps}
        isRunning={isRunning}
        stateBrush={formValues.stateBrush}
      />
      <section className="max-w-sm flex flex-col gap-4">
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
        <Button onClick={setIsRunning.toggle}>
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
