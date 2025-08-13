import { useRef } from "react";

import type { Automaton } from "@/lib/automaton";

import { Transition } from "@/lib/automaton/transitions";
import { Uint8Vector2 } from "@/routes/simulate/-board/uint8-vector2.ts";

export interface BoardConfig {
  readonly boardSize: number;
  readonly wrap: boolean;
}

export type UseBoard = ReturnType<typeof useBoard>;

export function useBoard(automaton: Automaton, config: BoardConfig) {
  const currentBoardRef = useRef(
    new Uint8Vector2(config.boardSize).fill(automaton.baseState),
  );
  const nextBoardRef = useRef(
    new Uint8Vector2(config.boardSize).fill(automaton.baseState),
  );

  function shouldTransition(transition: Transition, x: number, y: number) {
    const neighborhood = config.wrap
      ? currentBoardRef.current.getWrappingNeighborhood(x, y, 1)
      : currentBoardRef.current.getNeighborhood(x, y, 1);
    const counts = generatorCount(neighborhood);
    return transition.match({
      ExactNumberOfNeighborsTransition: (transition) =>
        transition.if_.every((count, state) => (counts[state] ?? 0) === count),
      PositionalNeighborTransition: (transition) =>
        transition.matchPosition({
          bottom: () => currentBoardRef.current.cellOnBottom(x, y, config.wrap),
          "bottom-left": () =>
            currentBoardRef.current.cellOnBottomLeft(x, y, config.wrap),
          "bottom-right": () =>
            currentBoardRef.current.cellOnBottomRight(x, y, config.wrap),
          left: () => currentBoardRef.current.cellOnLeft(x, y, config.wrap),
          right: () => currentBoardRef.current.cellOnRight(x, y, config.wrap),
          top: () => currentBoardRef.current.cellOnTop(x, y, config.wrap),
          "top-left": () =>
            currentBoardRef.current.cellOnTopLeft(x, y, config.wrap),
          "top-right": () =>
            currentBoardRef.current.cellOnTopRight(x, y, config.wrap),
        }) === transition.if_.state,
    });
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
    { advance, clear },
  ] as const;
}

function generatorCount(arr: Generator<number>): Record<number, number> {
  return arr.reduce<Record<number, number>>((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}
