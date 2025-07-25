import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AutomatonForm } from "@/components/automaton-form";
import { Board } from "@/components/board";
import { useBoard } from "@/components/board/use-board.ts";
import { SimulationForm } from "@/components/simulation-form";
import { useSimulationForm } from "@/components/simulation-form/use-simulation-form.ts";
import { builtins } from "@/lib/automata.ts";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const automaton = builtins.conwaysGameOfLife;
  const form = useSimulationForm(automaton);
  const board = useBoard(32, automaton);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <main className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_1fr] p-8 gap-6">
      <header className="col-span-2">
        <h1 className="text-xl">Celular Automata</h1>
      </header>
      <div className="row-span-2">
        <Board
          automaton={automaton}
          board={board}
          formValues={form.values}
          isRunning={isRunning}
        />
      </div>
      <SimulationForm
        {...form}
        automaton={automaton}
        isRunning={isRunning}
        onAdvanceAutomaton={board.advance}
        onClear={board.clear}
        onToggleAutomaton={() => {
          setIsRunning((prev) => !prev);
        }}
      />
      <AutomatonForm />
    </main>
  );
}
