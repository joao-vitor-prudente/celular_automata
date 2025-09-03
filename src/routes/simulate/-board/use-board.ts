import { useRef } from "react";

import type { Automaton } from "@/lib/automaton";

import { Transition } from "@/lib/automaton/transitions";
import { Cursor, Matrix, Neighborhood } from "@/lib/matrix";

export interface BoardConfig {
  readonly boardSize: number;
  readonly wrap: boolean;
}

export type UseBoard = ReturnType<typeof useBoard>;

export function useBoard(automaton: Automaton, config: BoardConfig) {
  const currentBoardRef = useRef(
    new Matrix(config.boardSize).fill(automaton.baseState),
  );
  const nextBoardRef = useRef(
    new Matrix(config.boardSize).fill(automaton.baseState),
  );

  function shouldTransition(transition: Transition, x: number, y: number) {
    const matrix = currentBoardRef.current;
    const cursor = Cursor.create({ matrix, x, y }, config.wrap);
    const neighborhood = new Neighborhood(cursor, 1);
    const counts = generatorCount(neighborhood.get());
    return transition.match({
      AlwaysTransition: () => true,
      ExactNumberOfNeighborsTransition: (transition) =>
        transition.if_.every((count, state) => (counts[state] ?? 0) === count),
      PositionalNeighborTransition: (transition) =>
        transition.matchPosition({
          bottom: () => cursor.down().get(),
          "bottom-left": () => cursor.down().left().get(),
          "bottom-right": () => cursor.down().right().get(),
          left: () => cursor.left().get(),
          right: () => cursor.right().get(),
          top: () => cursor.up().get(),
          "top-left": () => cursor.up().left().get(),
          "top-right": () => cursor.up().right().get(),
        }) === transition.if_.state,
    });
  }

  function changeSize(size: number) {
    currentBoardRef.current = new Matrix(size).fill(automaton.baseState);
    nextBoardRef.current = new Matrix(size).fill(automaton.baseState);
  }

  function advance() {
    currentBoardRef.current.forEach((state, x, y) => {
      const transitions = automaton.states[state].transitions;
      const transition = transitions.find((t) => shouldTransition(t, x, y));
      const newState = transition ? transition.then : state;
      nextBoardRef.current.set(x, y, newState);
    });

    const tempBoard = currentBoardRef.current;
    currentBoardRef.current = nextBoardRef.current;
    nextBoardRef.current = tempBoard;
  }

  function clear() {
    currentBoardRef.current.forEach((_, x, y) => {
      currentBoardRef.current.set(x, y, automaton.baseState);
      nextBoardRef.current.set(x, y, automaton.baseState);
    });
  }

  return [
    { config, ref: currentBoardRef },
    { advance, changeSize, clear },
  ] as const;
}

function generatorCount(arr: Generator<number>): Record<number, number> {
  return arr.reduce<Record<number, number>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}
