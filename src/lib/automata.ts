export interface Automaton {
  baseState: number;
  name: string;
  slug: string;
  states: AutomatonState[];
}

export interface AutomatonState {
  color: string;
  name: string;
  transitions: AutomatonStateTransition[];
}

export interface AutomatonStateTransition {
  if: number[];
  then: number;
}

const conwaysGameOfLife: Automaton = {
  baseState: 1,
  name: "Conway's Game of Life",
  slug: "conways_game_of_life",
  states: [
    {
      color: "oklch(0.985 0 0)",
      name: "alive",
      transitions: [
        { if: [0, 8], then: 1 },
        { if: [1, 7], then: 1 },
        { if: [4, 4], then: 1 },
        { if: [5, 3], then: 1 },
        { if: [6, 2], then: 1 },
        { if: [7, 1], then: 1 },
        { if: [8, 0], then: 1 },
      ],
    },
    {
      color: "oklch(0.205 0 0)",
      name: "dead",
      transitions: [{ if: [3, 5], then: 0 }],
    },
  ],
};

export const builtins: Automaton[] = [conwaysGameOfLife];
