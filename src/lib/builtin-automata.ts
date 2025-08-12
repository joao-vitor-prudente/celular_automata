import {
  Automaton,
  ExactNumberOfNeighborsTransition,
  State,
} from "@/lib/automaton";

const conwaysGameOfLife = new Automaton({
  baseState: 1,
  name: "Conway's Game of Life",
  slug: "conways_game_of_life",
  states: [
    new State({
      color: "oklch(0.985 0 0)",
      name: "Alive",
      transitions: [
        new ExactNumberOfNeighborsTransition({ if: [0, 8], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [1, 7], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [4, 4], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [5, 3], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [6, 2], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [7, 1], then: 1 }),
        new ExactNumberOfNeighborsTransition({ if: [8, 0], then: 1 }),
      ],
    }),
    new State({
      color: "oklch(0.205 0 0)",
      name: "Dead",
      transitions: [
        new ExactNumberOfNeighborsTransition({ if: [3, 5], then: 0 }),
      ],
    }),
  ],
});

export const builtins: Automaton[] = [conwaysGameOfLife];
