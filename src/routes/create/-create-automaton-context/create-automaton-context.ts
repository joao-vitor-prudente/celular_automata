import { createContext } from "react";

import type { GetterSetterPair, Merge } from "@/lib/extensions/types.ts";

export interface AutomatonStepData {
  id: string;
  name: string;
  stateNames: string[];
}

export type CreateAutomatonContext =
  | GetterSetterPair<CreateAutomatonContextAutomatonStep>
  | GetterSetterPair<CreateAutomatonContextInitialValue>
  | GetterSetterPair<CreateAutomatonContextStatesStep>
  | GetterSetterPair<CreateAutomatonContextTransitionsStep>;

export type CreateAutomatonContextAutomatonStep = Merge<
  AutomatonStepData,
  CreateAutomatonContextInitialValue
>;

export interface CreateAutomatonContextInitialValue {
  baseState: null;
  id: null;
  name: null;
  stateNames: null;
  statesData: null;
  transitions: null;
}

export type CreateAutomatonContextStatesStep = Merge<
  StatesStepData,
  CreateAutomatonContextAutomatonStep
>;

export type CreateAutomatonContextTransitionsStep = Merge<
  TransitionsStepData,
  CreateAutomatonContextStatesStep
>;

export interface StatesStepData {
  statesData: { color: string; name: string }[];
}

export interface TransitionsStepData {
  transitions: {
    if: Record<string, number>;
    state: string;
    then: string;
  }[];
}

export const CreateAutomatonContext =
  createContext<CreateAutomatonContext | null>(null);
