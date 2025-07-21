import { useState } from "react";

import type { Automaton } from "@/lib/automata.ts";

import {
  arrayCount,
  type ImmutableMatrix,
  intWrap,
  matrixCopy,
  matrixFill,
  matrixIter,
  objectEntries,
} from "@/lib/extensions";

export interface UseBoard<TState extends string> {
  advance(): void;

  set(i: number, j: number, value: TState): void;

  readonly state: ImmutableMatrix<TState>;
}

export function useBoard<TState extends string>(
  size: number,
  automaton: Automaton<TState>,
): UseBoard<TState> {
  const [state, setState] = useState(matrixFill(automaton.baseState, size));

  function getSurroundingStateCounts(
    boardState: ImmutableMatrix<TState>,
    i: number,
    j: number,
  ): Partial<Record<TState, number>> {
    return arrayCount([
      boardState[intWrap(i - 1, 0, size - 1)][intWrap(j - 1, 0, size - 1)],
      boardState[intWrap(i - 1, 0, size - 1)][j],
      boardState[intWrap(i - 1, 0, size - 1)][intWrap(j + 1, 0, size - 1)],
      boardState[i][intWrap(j - 1, 0, size - 1)],
      boardState[i][intWrap(j + 1, 0, size - 1)],
      boardState[intWrap(i + 1, 0, size - 1)][intWrap(j - 1, 0, size - 1)],
      boardState[intWrap(i + 1, 0, size - 1)][j],
      boardState[intWrap(i + 1, 0, size - 1)][intWrap(j + 1, 0, size - 1)],
    ]);
  }

  function computeNextState(
    cellState: TState,
    counts: Partial<Record<TState, number>>,
  ): TState {
    const transition = automaton.states[cellState].transitions.find((rule) =>
      objectEntries(rule.if).every(([s, c]) => (counts[s] ?? 0) === c),
    );
    return transition?.then ?? cellState;
  }

  function advance(): void {
    setState((prev) => {
      const curr = matrixCopy(prev);
      matrixIter(prev).forEach(([cell, i, j]) => {
        const counts = getSurroundingStateCounts(prev, i, j);
        curr[i][j] = computeNextState(cell, counts);
      });
      return curr;
    });
  }

  function set(i: number, j: number, value: TState): void {
    setState((prev) => {
      const curr = matrixCopy(prev);
      curr[i][j] = value;
      return curr;
    });
  }

  return { advance, set, state };
}
