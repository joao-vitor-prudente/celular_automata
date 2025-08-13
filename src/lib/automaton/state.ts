import { Transition, TransitionFactory } from "@/lib/automaton/transitions";
import { arrayRemoveAt, arraySetAt } from "@/lib/automaton/utils.ts";

export class State {
  public readonly color: string;
  public readonly name: string;
  public readonly transitions: Transition[];

  public constructor(options: {
    color: string;
    name: string;
    transitions?: Transition[];
  }) {
    this.name = options.name;
    this.color = options.color;
    this.transitions = options.transitions ?? [];
  }

  public static blank(name: string): State {
    return new State({ color: "", name, transitions: [] });
  }

  public static fromObject(obj: State): State {
    return new State({
      color: obj.color,
      name: obj.name,
      transitions: obj.transitions.map((transition) =>
        TransitionFactory.fromObject(transition),
      ),
    });
  }

  public addStateToTransitions(): State {
    return this.copyWith({
      transitions: this.transitions.map((t) =>
        t.match<Transition>({
          ExactNumberOfNeighborsTransition: (t) => t.addState(),
          PositionalNeighborTransition: (t) => t,
        }),
      ),
    });
  }

  public addTransition(transition: Transition): State {
    return this.copyWith({ transitions: [...this.transitions, transition] });
  }

  public copyWith(with_?: {
    color?: string;
    name?: string;
    transitions?: Transition[];
  }): State {
    return new State({
      color: with_?.color ?? this.color,
      name: with_?.name ?? this.name,
      transitions:
        with_?.transitions ?? this.transitions.map((t) => t.copyWith()),
    });
  }

  public removeStateFromTransitions(index: number): State {
    return this.copyWith({
      transitions: this.transitions.map((t) =>
        t.match<Transition>({
          ExactNumberOfNeighborsTransition: (t) => t.removeState(index),
          PositionalNeighborTransition: (t) => t,
        }),
      ),
    });
  }

  public removeTransition(index: number): State {
    return this.copyWith({
      transitions: arrayRemoveAt(this.transitions, index),
    });
  }

  public setTransition(index: number, transition: Transition): State {
    return this.copyWith({
      transitions: arraySetAt(this.transitions, index, transition),
    });
  }
}
