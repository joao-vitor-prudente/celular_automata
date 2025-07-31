import { useState } from "react";

import type { Automaton } from "@/lib/automata.ts";

import {
  arrayRemoveAt,
  arrayToRecord,
  objectDeepCopy,
  objectKeys,
  objectRemoveKey,
} from "@/lib/extensions";

export function useCreateAutomaton() {
  const [state, setState] = useState<Automaton>({
    baseState: "",
    name: "",
    slug: "",
    states: {},
  });

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
      const newState = objectDeepCopy(prev);
      newState.states[stateName] = { color: "", transitions: [] };
      return newState;
    });
  }

  function setStateColor(stateName: string, color: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateName].color = color;
      return newState;
    });
  }

  function removeState(stateName: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states = objectRemoveKey(newState.states, stateName);
      return newState;
    });
  }

  function setTransitionThen(
    stateName: string,
    transitionIndex: number,
    then: string,
  ) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateName].transitions[transitionIndex].then = then;
      return newState;
    });
  }

  function addTransition(stateName: string) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      const defaultIf = arrayToRecord(objectKeys(prev.states), 0);
      const defaultThen = objectKeys(prev.states).find((s) => s !== stateName);
      newState.states[stateName].transitions.push({
        if: defaultIf,
        then: defaultThen ?? stateName,
      });
      return newState;
    });
  }

  function removeTransition(stateName: string, transitionIndex: number) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateName].transitions = arrayRemoveAt(
        newState.states[stateName].transitions,
        transitionIndex,
      );
      return newState;
    });
  }

  function setTransitionIf(
    stateName: string,
    transitionIndex: number,
    stateIf: string,
    count: number,
  ) {
    setState((prev) => {
      const newState = objectDeepCopy(prev);
      newState.states[stateName].transitions[transitionIndex].if[stateIf] =
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
