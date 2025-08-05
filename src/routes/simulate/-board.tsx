import { useEffect } from "react";
import { z } from "zod";

import type { Automaton } from "@/lib/automata.ts";

import { matrixIter } from "@/lib/extensions";

import type { UseBoard } from "./-use-board.ts";

interface BoardProps<TState extends string> {
  readonly automaton: Automaton<TState>;
  readonly board: UseBoard<TState>;
  readonly fps: number;
  readonly isRunning: boolean;
  readonly stateBrush: TState;
}

export function Board<TState extends string>(props: BoardProps<TState>) {
  useEffect(() => {
    if (!props.isRunning) return;

    props.board.advance();
    const interval = setInterval(() => {
      props.board.advance();
    }, 1000 / props.fps);

    return () => {
      clearInterval(interval);
    };
  }, [props.isRunning, props.fps]);

  function validateState(state: string): TState {
    return z.enum(props.automaton.states.map((s) => s.name)).parse(state);
  }

  return (
    <section className="grid grid-cols-32">
      {matrixIter(props.board.state)
        .map(([cell, i, j]) => (
          <button
            className="size-6 border border-background"
            disabled={props.isRunning}
            key={`(${i.toString()}, ${j.toString()})`}
            onClick={() => {
              props.board.set(i, j, validateState(props.stateBrush));
            }}
            style={{
              background:
                props.automaton.states[props.board.stateNameToIndex[cell]]
                  .color,
            }}
          />
        ))
        .toArray()}
    </section>
  );
}
