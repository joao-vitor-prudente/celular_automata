import {
  Transition,
  type TransitionCases,
  type TransitionOptions,
  TransitionType,
} from "@/lib/automaton/transitions/transition";
import { arrayRemoveAt } from "@/lib/automaton/utils.ts";

type If = number[];

export class ExactNumberOfNeighborsTransition extends Transition<If> {
  public override readonly type = TransitionType.exactNumberOfNeighbors;

  public static blank(options: {
    originState: number;
    stateCount: number;
  }): ExactNumberOfNeighborsTransition {
    return new ExactNumberOfNeighborsTransition({
      if: Array.from({ length: options.stateCount }, () => 0),
      then: options.originState === 0 && options.stateCount > 0 ? 1 : 0,
    });
  }

  public addState(): ExactNumberOfNeighborsTransition {
    return this.copyWith({
      if: [...this.if_, 0],
    });
  }

  public override copyWith(
    with_?: Partial<TransitionOptions<If>>,
  ): ExactNumberOfNeighborsTransition {
    return new ExactNumberOfNeighborsTransition({
      if: with_?.if ?? [...this.if_],
      then: with_?.then ?? this.then,
    });
  }

  public override match<T>(cases: TransitionCases<T>): T {
    return cases.ExactNumberOfNeighborsTransition(this);
  }

  public removeState(index: number): ExactNumberOfNeighborsTransition {
    return this.copyWith({
      if: arrayRemoveAt(this.if_, index),
    });
  }

  public setIf(state: number, value: number): ExactNumberOfNeighborsTransition {
    const newIf = [...this.if_];
    newIf[state] = value;
    return this.copyWith({ if: newIf });
  }
}
