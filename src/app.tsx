import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const formSchema = z.object({
  frameDuration: z.number(),
  stateBrush: z.number(),
});

export function App() {
  const form = useForm({
    defaultValues: { frameDuration: 1000, stateBrush: 1 },
    resolver: zodResolver(formSchema),
  });
  const frameDuration = useWatch({
    control: form.control,
    name: "frameDuration",
  });
  const stateBrush = useWatch({
    control: form.control,
    name: "stateBrush",
  });
  const stateBrushSelectId = useId();
  const frameDurationInputId = useId();

  const [boardState, setBoardState] = useState(
    Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 0)),
  );

  function advanceBoardState() {
    setBoardState((prev) => {
      const curr = prev.map((row) => [...row]);
      for (const [i, row] of prev.entries()) {
        for (const [j, cell] of row.entries()) {
          const leftIndex = j - 1 < 0 ? row.length - 1 : j - 1;
          const rightIndex = j + 1 > row.length - 1 ? 0 : j + 1;
          const topIndex = i - 1 < 0 ? prev.length - 1 : i - 1;
          const bottomIndex = i + 1 > prev.length - 1 ? 0 : i + 1;
          const surroundingStates = [
            prev[topIndex][leftIndex],
            prev[topIndex][j],
            prev[topIndex][rightIndex],
            prev[i][leftIndex],
            prev[i][rightIndex],
            prev[bottomIndex][leftIndex],
            prev[bottomIndex][j],
            prev[bottomIndex][rightIndex],
          ];

          const aliveCount = surroundingStates.reduce((a, b) => a + b, 0);
          if (cell === 0 && aliveCount === 3) curr[i][j] = 1;
          if (cell === 1 && aliveCount < 2) curr[i][j] = 0;
          if (cell === 1 && aliveCount > 3) curr[i][j] = 0;
          if (cell === 1 && (aliveCount === 2 || aliveCount === 3))
            curr[i][j] = 1;
        }
      }
      return curr;
    });
  }

  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    if (!isRunning) return;

    advanceBoardState();
    const interval = setInterval(() => {
      advanceBoardState();
    }, frameDuration);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, advanceBoardState, frameDuration]);

  return (
    <main className="grid grid-cols-[auto_1fr] p-8 gap-6">
      <header className="col-span-2">
        <h1>Celular Automata</h1>
      </header>
      <section className="grid grid-cols-32 gap-1">
        {boardState.map((row, i) =>
          row.map((cell, j) => (
            <button
              className="size-6 data-[status=0]:bg-card data-[status=1]:bg-card-foreground"
              data-status={cell}
              key={i * 32 + j}
              onClick={() => {
                setBoardState((prev) => {
                  const curr = prev.map((row) => [...row]);
                  curr[i][j] = curr[i][j] === stateBrush ? 0 : stateBrush;
                  return curr;
                });
              }}
            />
          )),
        )}
      </section>
      <section className="max-w-sm flex flex-col gap-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="stateBrush"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={stateBrushSelectId}>State Brush</FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    onValueChange={(v) => {
                      field.onChange(Number.parseInt(v));
                    }}
                    value={field.value.toString()}
                  >
                    <SelectTrigger
                      disabled={field.disabled}
                      id={stateBrushSelectId}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Dead</SelectItem>
                      <SelectItem value="1">Alive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  The state to paint the initial configuration of the board
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frameDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={frameDurationInputId}>
                  Frame Duration
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={frameDurationInputId}
                    onChange={(e) => {
                      field.onChange(Number.parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>Duration of each frame in ms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <Button
          onClick={() => {
            setIsRunning((prev) => !prev);
          }}
          type="button"
        >
          {isRunning ? "Stop Automaton" : "Start Automaton"}
        </Button>
        <Button onClick={advanceBoardState} type="button">
          Advance Automaton
        </Button>
      </section>
    </main>
  );
}
