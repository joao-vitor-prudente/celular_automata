import { z } from "zod";

import {
  Transition,
  type TransitionCases,
  type TransitionOptions,
  TransitionType,
} from "@/lib/automaton/transitions/transition.ts";

interface If {
  position:
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "left"
    | "right"
    | "top"
    | "top-left"
    | "top-right";
  state: number;
}

export class PositionalNeighborTransition extends Transition<If> {
  public override readonly type = TransitionType.positionalNeighbor;

  public static blank(options: {
    originState: number;
    stateCount: number;
  }): PositionalNeighborTransition {
    return new PositionalNeighborTransition({
      if: { position: "top", state: 0 },
      then: options.originState === 0 && options.stateCount > 0 ? 1 : 0,
    });
  }

  public static validatePosition(position: string): position is If["position"] {
    return z
      .enum([
        "top",
        "bottom",
        "left",
        "right",
        "bottom-left",
        "bottom-right",
        "top-left",
        "top-right",
      ])
      .safeParse(position).success;
  }

  public override copyWith(
    with_?: Partial<TransitionOptions<If>>,
  ): PositionalNeighborTransition {
    return new PositionalNeighborTransition({
      if: with_?.if ?? this.if_,
      then: with_?.then ?? this.then,
    });
  }

  public override match<T>(cases: TransitionCases<T>): T {
    return cases.PositionalNeighborTransition(this);
  }

  public matchPosition<T>(
    cases: Record<If["position"], (position: string) => T>,
  ): T {
    return cases[this.if_.position](this.if_.position);
  }

  public setIfPosition(position: If["position"]) {
    return this.copyWith({ if: { ...this.if_, position } });
  }

  public setIfState(state: number) {
    return this.copyWith({ if: { ...this.if_, state } });
  }
}
