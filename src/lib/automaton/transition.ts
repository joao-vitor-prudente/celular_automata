import { arrayRemoveAt } from "@/lib/automaton/utils.ts";

enum TransitionType {
  exactNumberOfNeighbors = "exactNumberOfNeighbors",
}

interface TransitionCases<T> {
  ExactNumberOfNeighborsTransition: (
    value: ExactNumberOfNeighborsTransition,
  ) => T;
}

export abstract class Transition {
  public abstract readonly type: TransitionType;

  protected constructor(public readonly then: number) {}

  public static fromObject(obj: Transition): Transition {
    switch (obj.type) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case TransitionType.exactNumberOfNeighbors:
        return ExactNumberOfNeighborsTransition.fromObject(
          obj as ExactNumberOfNeighborsTransition,
        );
    }
  }

  public abstract copyWith(): Transition;

  public abstract match<T>(cases: TransitionCases<T>): T;
}

export class ExactNumberOfNeighborsTransition extends Transition {
  public readonly if_: number[];

  public override readonly type = TransitionType.exactNumberOfNeighbors;

  public constructor(options: { if: number[]; then: number }) {
    super(options.then);
    this.if_ = options.if;
  }

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
