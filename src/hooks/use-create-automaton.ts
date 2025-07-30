import { useState } from "react";
import { z } from "zod";

import type { Automaton } from "@/lib/automata.ts";

import {
  arrayEquals,
  arrayRemoveAt,
  arraySum,
  arrayToRecord,
  objectEntries,
  objectKeys,
  objectRemoveKey,
  objectValues,
} from "@/lib/extensions";

const automatonSchema = z
  .object({
    baseState: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    states: z.record(
      z.string().min(1),
      z.object({
        color: z.string().min(1),
        transitions: z.array(
          z.object({
            if: z.record(z.string(), z.number()),
            then: z.string().min(1),
          }),
        ),
      }),
    ),
  })
  .refine((value) => {
    if (!(value.baseState in value.states)) return false;
    const transitions = objectEntries(value.states).flatMap(([state, data]) =>
      data.transitions.map((t) => ({ state, ...t })),
    );

    return transitions.every((t) => {
      if (t.state === t.then) return false;
      if (!arrayEquals(objectKeys(value.states), objectKeys(t.if)))
        return false;
      return arraySum(objectValues(t.if)) === 8;
    });
  });

export function useCreateAutomaton() {
  const [state, setState] = useState<Automaton>({
    baseState: "",
    name: "",
    slug: "",
    states: {},
  });

  function setName(name: string) {
    setState((prev) => ({ ...prev, name }));
  }

  function setSlug(slug: string) {
    setState((prev) => ({ ...prev, slug }));
  }

  function setBaseState(baseState: string) {
    setState((prev) => ({ ...prev, baseState }));
  }

  function addState(stateName: string) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: { color: "", transitions: [] },
      },
    }));
  }

  function setStateColor(stateName: string, color: string) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: { ...prev.states[stateName], color },
      },
    }));
  }

  function removeState(stateName: string) {
    setState((prev) => ({
      ...prev,
      states: objectRemoveKey(prev.states, stateName),
    }));
  }

  function setTransitionThen(
    stateName: string,
    transitionIndex: number,
    then: string,
  ) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: {
          ...prev.states[stateName],
          transitions: prev.states[stateName].transitions.map((t, i) =>
            i !== transitionIndex ? t : { ...t, then },
          ),
        },
      },
    }));
  }

  function addTransition(stateName: string) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: {
          ...prev.states[stateName],
          transitions: [
            ...prev.states[stateName].transitions,
            {
              if: arrayToRecord(objectKeys(prev.states), 0),
              then:
                objectKeys(prev.states).find((state) => state !== stateName) ??
                stateName,
            },
          ],
        },
      },
    }));
  }

  function removeTransition(stateName: string, transitionIndex: number) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: {
          ...prev.states[stateName],
          transitions: arrayRemoveAt(
            prev.states[stateName].transitions,
            transitionIndex,
          ),
        },
      },
    }));
  }

  function setTransitionIf(
    stateName: string,
    transitionIndex: number,
    stateIf: string,
    count: number,
  ) {
    setState((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [stateName]: {
          ...prev.states[stateName],
          transitions: prev.states[stateName].transitions.map((t, i) =>
            i !== transitionIndex
              ? t
              : { ...t, if: { ...t.if, [stateIf]: count } },
          ),
        },
      },
    }));
  }

  function validateAutomaton() {
    console.log(state);
    console.log(automatonSchema.safeParse(state).error);
    return automatonSchema.safeParse(state).success;
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
      validateAutomaton,
    },
  ] as const;
}
