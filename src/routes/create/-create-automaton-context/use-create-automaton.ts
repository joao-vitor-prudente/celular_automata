import { useContext } from "react";

import type { GetterSetterPair } from "@/lib/extensions/types.ts";

import {
  type AutomatonStepData,
  CreateAutomatonContext,
  type CreateAutomatonContextAutomatonStep,
  type CreateAutomatonContextInitialValue,
  type CreateAutomatonContextStatesStep,
  type CreateAutomatonContextTransitionsStep,
  type StatesStepData,
  type TransitionsStepData,
} from "@/routes/create/-create-automaton-context/create-automaton-context.ts";

export function useCreateAutomaton<
  TStep extends "automaton" | "states" | "transitions",
>() {
  const context = useContext(CreateAutomatonContext);
  if (context === null) {
    throw new Error(
      "useCreateAutomaton should be used within CreateAutomatonProvider",
    );
  }

  const [state, setState] = context as unknown as GetterSetterPair<
    {
      automaton:
        | CreateAutomatonContextAutomatonStep
        | CreateAutomatonContextInitialValue;
      states:
        | CreateAutomatonContextAutomatonStep
        | CreateAutomatonContextStatesStep;
      transitions:
        | CreateAutomatonContextStatesStep
        | CreateAutomatonContextTransitionsStep;
    }[TStep]
  >;

  function fillStepData(
    data: {
      automaton: AutomatonStepData;
      states: StatesStepData;
      transitions: TransitionsStepData;
    }[TStep],
  ) {
    setState((prev) => ({ ...prev, ...data }));
  }

  return [state, fillStepData] as const;
}
