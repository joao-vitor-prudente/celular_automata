export interface Automaton<TState extends string = string> {
  baseState: TState;
  name: string;
  slug: string;
  states: Record<
    TState,
    {
      color: string;
      transitions: {
        if: Record<TState, number>;
        then: TState;
      }[];
    }
  >;
}

const conwaysGameOfLife: Automaton = {
  baseState: "dead",
  name: "Conway's Game of Life",
  slug: "conways_game_of_life",
  states: {
    alive: {
      color: "oklch(0.985 0 0)",
      transitions: [
        { if: { alive: 0, dead: 8 }, then: "dead" },
        { if: { alive: 1, dead: 7 }, then: "dead" },
        { if: { alive: 4, dead: 4 }, then: "dead" },
        { if: { alive: 5, dead: 3 }, then: "dead" },
        { if: { alive: 6, dead: 2 }, then: "dead" },
        { if: { alive: 7, dead: 1 }, then: "dead" },
        { if: { alive: 8, dead: 0 }, then: "dead" },
      ],
    },
    dead: {
      color: "oklch(0.205 0 0)",
      transitions: [{ if: { alive: 3, dead: 5 }, then: "alive" }],
    },
  },
} satisfies Automaton<"alive" | "dead">;

export const builtins: Record<string, Automaton> = {
  conwaysGameOfLife,
};
