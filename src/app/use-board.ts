import { useState } from "react";

import type { Automaton } from "@/app/automata.ts";

import {
  arrayCount,
  matrixCopy,
  matrixFill,
  matrixIter,
  objectEntries,
} from "@/lib/utils.ts";

export interface UseBoard<TState extends string> {
  advance(): void;

  set(i: number, j: number, value: TState): void;

  state: TState[][];
}

export function useBoard<TState extends string>(
  size: number,
  automaton: Automaton<TState>,
): UseBoard<TState> {
  const [state, setState] = useState(matrixFill(automaton.baseState, size));

  function getSurroundingStateCounts(
    boardState: TState[][],
    i: number,
    j: number,
  ): Partial<Record<TState, number>> {
    const leftIndex = j - 1 < 0 ? size - 1 : j - 1;
    const rightIndex = j + 1 > size - 1 ? 0 : j + 1;
    const topIndex = i - 1 < 0 ? size - 1 : i - 1;
    const bottomIndex = i + 1 > size - 1 ? 0 : i + 1;
    return arrayCount([
      boardState[topIndex][leftIndex],
      boardState[topIndex][j],
      boardState[topIndex][rightIndex],
      boardState[i][leftIndex],
      boardState[i][rightIndex],
      boardState[bottomIndex][leftIndex],
      boardState[bottomIndex][j],
      boardState[bottomIndex][rightIndex],
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
