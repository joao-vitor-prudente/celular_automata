import { useEffect } from "react";
import { z } from "zod";

import type { UseBoard } from "@/components/board/use-board.ts";
import type { UseSimulationForm } from "@/components/simulation-form/use-simulation-form.ts";
import type { Automaton } from "@/lib/automata.ts";

import { matrixIter, objectKeys } from "@/lib/extensions";

interface BoardProps<TState extends string> {
  readonly automaton: Automaton<TState>;
  readonly board: UseBoard<TState>;
  readonly formValues: UseSimulationForm["values"];
  readonly isRunning: boolean;
}

export function Board<TState extends string>(props: BoardProps<TState>) {
  useEffect(() => {
    if (!props.isRunning) return;

    props.board.advance();
    const interval = setInterval(() => {
      props.board.advance();
    }, 1000 / props.formValues.fps);

    return () => {
      clearInterval(interval);
    };
  }, [props.isRunning, props.formValues.fps]);

  function validateState(state: string): TState {
    return z.enum(objectKeys(props.automaton.states)).parse(state);
  }

  return (
    <section className="grid grid-cols-32 gap-1">
      {matrixIter(props.board.state)
        .map(([cell, i, j]) => (
          <button
            className="size-6"
            disabled={props.isRunning}
            key={`(${i.toString()}, ${j.toString()})`}
            onClick={() => {
              props.board.set(i, j, validateState(props.formValues.stateBrush));
            }}
            style={{
              background: props.automaton.states[cell].color,
            }}
          />
        ))
        .toArray()}
    </section>
  );
}
