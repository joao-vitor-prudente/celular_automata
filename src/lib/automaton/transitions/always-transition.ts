import {
  Transition,
  type TransitionCases,
  type TransitionOptions,
  TransitionType,
} from "@/lib/automaton/transitions/transition.ts";

type If = null;

export class AlwaysTransition extends Transition<If> {
  public override readonly type = TransitionType.exactNumberOfNeighbors;

  public static blank(options: {
    originState: number;
    stateCount: number;
  }): AlwaysTransition {
    return new AlwaysTransition({
      if: null,
      then: options.originState === 0 && options.stateCount > 0 ? 1 : 0,
    });
  }

  public override copyWith(
    with_?: Partial<TransitionOptions<If>>,
  ): AlwaysTransition {
    return new AlwaysTransition({
      if: null,
      then: with_?.then ?? this.then,
    });
  }

  public override match<T>(cases: TransitionCases<T>): T {
    return cases.AlwaysTransition(this);
  }
}
