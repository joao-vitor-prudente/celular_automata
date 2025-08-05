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
  readonly advance: () => void;
  readonly clear: () => void;
  readonly set: (i: number, j: number, value: TState) => void;
  readonly state: ImmutableMatrix<TState>;
  readonly stateNameToIndex: Record<string, number>;
}

export function useBoard<TState extends string>(
  size: number,
  automaton: Automaton<TState>,
): UseBoard<TState> {
  const [state, setState] = useState(matrixFill(automaton.baseState, size));

  const stateNameToIndex = automaton.states.reduce(
    (acc, cur, i) => {
      acc[cur.name] = i;
      return acc;
    },
    {} as Record<TState, number>,
  );

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
    const transition = automaton.states[
      stateNameToIndex[cellState]
    ].transitions.find((rule) =>
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

  function clear(): void {
    setState(matrixFill(automaton.baseState, size));
  }

  function set(i: number, j: number, value: TState): void {
    setState((prev) => {
      const curr = matrixCopy(prev);
      curr[i][j] = value;
      return curr;
    });
  }

  return { advance, clear, set, state, stateNameToIndex };
}
