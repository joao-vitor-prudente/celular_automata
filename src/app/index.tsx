import { useState } from "react";

import { Board } from "@/app/board.tsx";
import { SimulationForm } from "@/app/simulation-form.tsx";
import { useBoard } from "@/app/use-board.ts";
import { useSimulationForm } from "@/app/use-simulation-form.ts";

export function App() {
  const form = useSimulationForm();
  const board = useBoard(32);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <main className="grid grid-cols-[auto_1fr] p-8 gap-6">
      <header className="col-span-2">
        <h1>Celular Automata</h1>
      </header>
      <Board board={board} formValues={form.values} isRunning={isRunning} />
      <SimulationForm
        {...form}
        isRunning={isRunning}
        onAdvanceAutomaton={board.advance}
        onToggleAutomaton={() => {
          setIsRunning((prev) => !prev);
        }}
      />
    </main>
  );
}
