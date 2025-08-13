import type { ExactNumberOfNeighborsTransition } from "@/lib/automaton/transitions/exact-number-of-neighbors-transition.ts";
import type { PositionalNeighborTransition } from "@/lib/automaton/transitions/positional-neighbor-transition.ts";

export enum TransitionType {
  exactNumberOfNeighbors = "exactNumberOfNeighbors",
  positionalNeighbor = "positionalNeighbor",
}

export interface TransitionCases<T> {
  ExactNumberOfNeighborsTransition: (
    value: ExactNumberOfNeighborsTransition,
  ) => T;
  PositionalNeighborTransition: (value: PositionalNeighborTransition) => T;
}

export interface TransitionOptions<TIf> {
  if: TIf;
  then: number;
}

export abstract class Transition<TIf = unknown> {
  public readonly if_: TIf;
  public readonly then: number;
  public abstract readonly type: TransitionType;

  public constructor(options: TransitionOptions<TIf>) {
    this.if_ = options.if;
    this.then = options.then;
  }

  public abstract copyWith(
    with_?: Partial<TransitionOptions<TIf>>,
  ): Transition<TIf>;

  public abstract match<T>(cases: TransitionCases<T>): T;
}
