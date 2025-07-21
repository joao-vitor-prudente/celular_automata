import { useState } from "react";

import { builtins } from "@/app/automata.ts";
import { Board } from "@/app/board.tsx";
import { SimulationForm } from "@/app/simulation-form.tsx";
import { useBoard } from "@/app/use-board.ts";
import { useSimulationForm } from "@/app/use-simulation-form.ts";

export function App() {
  const automaton = builtins.conwaysGameOfLife;
  const form = useSimulationForm(automaton);
  const board = useBoard(32, automaton);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <main className="grid grid-cols-[auto_1fr] p-8 gap-6">
      <header className="col-span-2">
        <h1>Celular Automata</h1>
      </header>
      <Board
        automaton={automaton}
        board={board}
        formValues={form.values}
        isRunning={isRunning}
      />
      <SimulationForm
        {...form}
        automaton={automaton}
        isRunning={isRunning}
        onAdvanceAutomaton={() => {
          board.advance();
        }}
        onToggleAutomaton={() => {
          setIsRunning((prev) => !prev);
        }}
      />
    </main>
  );
}
