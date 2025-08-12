import { State } from "@/lib/automaton/state.ts";
import { arrayRemoveAt, arraySetAt } from "@/lib/automaton/utils.ts";

export class Automaton {
  public readonly baseState: number;
  public readonly name: string;
  public readonly slug: string;
  public readonly states: State[];

  public constructor(options: {
    baseState: number;
    name: string;
    slug: string;
    states: State[];
  }) {
    this.name = options.name;
    this.slug = options.slug;
    this.states = options.states;
    this.baseState = options.baseState;
  }

  public static blank(): Automaton {
    return new Automaton({ baseState: 0, name: "", slug: "", states: [] });
  }

  public static fromObject(obj: Automaton): Automaton {
    return new Automaton({
      baseState: obj.baseState,
      name: obj.name,
      slug: obj.slug,
      states: obj.states.map((state) => State.fromObject(state)),
    });
  }

  public addState(state: State): Automaton {
    const newStates = [
      ...this.states.map((state) => state.addStateToTransitions()),
      state,
    ];
    return this.copyWith({ states: newStates });
  }

  public copyWith(with_?: {
    baseState?: number;
    name?: string;
    slug?: string;
    states?: State[];
  }): Automaton {
    return new Automaton({
      baseState: with_?.baseState ?? this.baseState,
      name: with_?.name ?? this.name,
      slug: with_?.slug ?? this.slug,
      states: with_?.states ?? this.states.map((s) => s.copyWith()),
    });
  }

  public removeState(index: number): Automaton {
    const newStates = arrayRemoveAt(
      this.states.map((state) => state.removeStateFromTransitions(index)),
      index,
    );
    return this.copyWith({ states: newStates });
  }

  public setState(index: number, state: State): Automaton {
    return this.copyWith({ states: arraySetAt(this.states, index, state) });
  }
}
