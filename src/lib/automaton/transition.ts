import { arrayRemoveAt } from "@/lib/automaton/utils.ts";

enum TransitionType {
  exactNumberOfNeighbors = "exactNumberOfNeighbors",
  positionalNeighbor = "positionalNeighbor",
}

type ExactNumberOfNeighborsTransitionIf = number[];

interface PositionalNeighborTransitionIf {
  position: "bottom" | "left" | "right" | "top";
  state: number;
}

interface TransitionCases<T> {
  ExactNumberOfNeighborsTransition: (
    value: ExactNumberOfNeighborsTransition,
  ) => T;
  PositionalNeighborTransition: (value: PositionalNeighborTransition) => T;
}

interface TransitionOptions<TIf> {
  if: TIf;
  then: number;
}

abstract class Transition<TIf = unknown> {
  public readonly if_: TIf;
  public readonly then: number;
  public abstract readonly type: TransitionType;

  protected constructor(options: TransitionOptions<TIf>) {
    this.if_ = options.if;
    this.then = options.then;
  }

  public static fromObject(obj: Transition): Transition {
    switch (obj.type) {
      case TransitionType.exactNumberOfNeighbors:
        return ExactNumberOfNeighborsTransition.fromObject(
          obj as ExactNumberOfNeighborsTransition,
        );
      case TransitionType.positionalNeighbor:
        return PositionalNeighborTransition.fromObject(
          obj as PositionalNeighborTransition,
        );
    }
  }

  public abstract copyWith(with_: { then?: number }): Transition<TIf>;

  public abstract match<T>(cases: TransitionCases<T>): T;
}

class ExactNumberOfNeighborsTransition extends Transition<ExactNumberOfNeighborsTransitionIf> {
  public override readonly type = TransitionType.exactNumberOfNeighbors;

  public static blank(
    stateCount: number,
    originState: number,
  ): ExactNumberOfNeighborsTransition {
    return new ExactNumberOfNeighborsTransition({
      if: Array.from({ length: stateCount }, () => 0),
      then: originState === 0 && stateCount > 0 ? 1 : 0,
    });
  }

  public static fromObject(
    obj: ExactNumberOfNeighborsTransition,
  ): ExactNumberOfNeighborsTransition {
    return new ExactNumberOfNeighborsTransition({
      if: obj.if_,
      then: obj.then,
    });
  }

  public addState(): ExactNumberOfNeighborsTransition {
    return this.copyWith({
      if: [...this.if_, 0],
    });
  }

  public override copyWith(with_?: {
    if?: number[];
    then?: number;
  }): ExactNumberOfNeighborsTransition {
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

class PositionalNeighborTransition extends Transition<PositionalNeighborTransitionIf> {
  public override readonly type = TransitionType.positionalNeighbor;

  public static blank(
    stateCount: number,
    originState: number,
  ): PositionalNeighborTransition {
    return new PositionalNeighborTransition({
      if: { position: "top", state: 0 },
      then: originState === 0 && stateCount > 0 ? 1 : 0,
    });
  }

  public static fromObject(
    obj: PositionalNeighborTransition,
  ): PositionalNeighborTransition {
    return new PositionalNeighborTransition({
      if: obj.if_,
      then: obj.then,
    });
  }

  public override copyWith(with_: {
    if?: PositionalNeighborTransitionIf;
    then?: number;
  }): PositionalNeighborTransition {
    return new PositionalNeighborTransition({
      if: with_.if ?? this.if_,
      then: with_.then ?? this.then,
    });
  }

  public override match<T>(cases: TransitionCases<T>): T {
    return cases.PositionalNeighborTransition(this);
  }
}
