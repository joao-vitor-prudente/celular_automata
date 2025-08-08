import { useState } from "react";

import type { Automaton } from "@/lib/automata.ts";

export function useAutomatonForm(initial?: Automaton) {
  const [state, setState] = useState<Automaton>(
    initial ?? { baseState: 0, name: "", slug: "", states: [] },
  );

  function setName(name: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.name = name;
      return newState;
    });
  }

  function setSlug(slug: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.slug = slug;
      return newState;
    });
  }

  function setBaseState(baseState: number) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.baseState = baseState;
      return newState;
    });
  }

  function addState(stateName: string) {
    setState((prev) => {
      if (prev.states.find((s) => s.name === stateName)) return prev;
      const newState = objectDeepCopy(prev);
      newState.states.push({ color: "", name: stateName, transitions: [] });
      return newState;
    });
  }

  function setStateColor(stateIndex: number, color: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateIndex].color = color;
      return newState;
    });
  }

  function removeState(stateIndex: number) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states = arrayRemoveAt(newState.states, stateIndex);
      return newState;
    });
  }

  function setTransitionThen(
    stateIndex: number,
    transitionIndex: number,
    then: number,
  ) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateIndex].transitions[transitionIndex].then = then;
      return newState;
    });
  }

  function addTransition(stateIndex: number) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateIndex].transitions.push({
        if: Array.from({ length: prev.states.length }, () => 0),
        then: stateIndex === 0 && prev.states.length > 0 ? 1 : 0,
      });
      return newState;
    });
  }

  function removeTransition(stateIndex: number, transitionIndex: number) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateIndex].transitions = arrayRemoveAt(
        newState.states[stateIndex].transitions,
        transitionIndex,
      );
      return newState;
    });
  }

  function setTransitionIf(
    stateIndex: number,
    transitionIndex: number,
    stateIf: number,
    count: number,
  ) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateIndex].transitions[transitionIndex].if[stateIf] =
        count;
      return newState;
    });
  }

  return [
    state,
    {
      addState,
      addTransition,
      removeState,
      removeTransition,
      setBaseState,
      setName,
      setSlug,
      setStateColor,
      setTransitionIf,
      setTransitionThen,
    },
  ] as const;
}

function arrayRemoveAt<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

function objectDeepCopy<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
