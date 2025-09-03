import { AlwaysTransition } from "@/lib/automaton/transitions/always-transition.ts";
import { ExactNumberOfNeighborsTransition } from "@/lib/automaton/transitions/exact-number-of-neighbors-transition.ts";
import { PositionalNeighborTransition } from "@/lib/automaton/transitions/positional-neighbor-transition.ts";
import {
  type Transition,
  TransitionType,
} from "@/lib/automaton/transitions/transition.ts";

type ExtractIf<T extends Transition> =
  T extends Transition<infer U> ? U : never;

export class TransitionFactory {
  public static fromObject(obj: Transition): Transition {
    switch (obj.type) {
      case TransitionType.always:
        return new AlwaysTransition({ if: null, then: obj.then });
      case TransitionType.exactNumberOfNeighbors:
        return new ExactNumberOfNeighborsTransition({
          if: obj.if_ as ExtractIf<ExactNumberOfNeighborsTransition>,
          then: obj.then,
        });
      case TransitionType.positionalNeighbor:
        return new PositionalNeighborTransition({
          if: obj.if_ as ExtractIf<PositionalNeighborTransition>,
          then: obj.then,
        });
    }
  }

  public blank(
    type: TransitionType,
    options: { originState: number; stateCount: number },
  ): Transition {
    switch (type) {
      case TransitionType.always:
        return AlwaysTransition.blank(options);
      case TransitionType.exactNumberOfNeighbors:
        return ExactNumberOfNeighborsTransition.blank(options);
      case TransitionType.positionalNeighbor:
        return PositionalNeighborTransition.blank(options);
    }
  }
}
