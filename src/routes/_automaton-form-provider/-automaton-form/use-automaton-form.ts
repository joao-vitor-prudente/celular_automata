import { useState } from "react";

import type { Automaton } from "@/lib/automata.ts";

import { arrayRemoveAt, arrayToRecord, objectDeepCopy } from "@/lib/extensions";

export function useAutomatonForm(initial?: Automaton) {
  const [state, setState] = useState<Automaton>(
    initial ?? { baseState: "", name: "", slug: "", states: [] },
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

  function setBaseState(baseState: string) {
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
    then: string,
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
      const stateName = newState.states[stateIndex].name;
      const defaultIf = arrayToRecord(
        prev.states.map((s) => s.name),
        0,
      );
      const defaultThen = prev.states.find((s) => s.name !== stateName);
      newState.states[stateIndex].transitions.push({
        if: defaultIf,
        then: defaultThen?.name ?? stateName,
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
    stateIf: string,
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
