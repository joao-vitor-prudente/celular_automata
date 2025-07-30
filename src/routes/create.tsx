import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useState } from "react";

import type { Automaton } from "@/lib/automata.ts";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { MultiInput } from "@/components/ui/multi-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  arrayRemoveAt,
  arrayToRecord,
  objectEntries,
  objectKeys,
  objectRemoveKey,
  stringCapitalize,
} from "@/lib/extensions";

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, setState] = useCreateAutomaton();

  return (
    <section className="m-8 grid grid-cols-2 gap-y-6 gap-x-4">
      <div className="space-y-2">
        <Label>
          <span>Name</span>
          <Input
            onChange={(e) => {
              setState.setName(e.target.value);
            }}
            value={state.name}
          />
        </Label>
        <Label>
          <span>Slug</span>
          <Input
            onChange={(e) => {
              setState.setSlug(e.target.value);
            }}
            value={state.slug}
          />
        </Label>
      </div>
      <div className="space-y-2">
        <Label>
          <span className="whitespace-nowrap">Base State</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {objectKeys(state.states).map((state) => (
                <SelectItem key={state} value={state}>
                  {stringCapitalize(state)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
        <Label>
          <span className="whitespace-nowrap">Add State</span>
          <MultiInput
            onAdd={setState.addState}
            value={objectKeys(state.states)}
          />
        </Label>
      </div>
      {objectEntries(state.states).map(([stateName, stateData]) => (
        <>
          <Card className="rounded-r-none">
            <CardHeader>
              <CardTitle>{stringCapitalize(stateName)} State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>
                <span>Color</span>
                <Input
                  onChange={(e) => {
                    setState.setStateColor(stateName, e.target.value);
                  }}
                  value={stateData.color}
                />
              </Label>
            </CardContent>
            <CardFooter>
              <CardAction>
                <Button
                  onClick={() => {
                    setState.removeState(stateName);
                  }}
                  variant="destructive"
                >
                  Delete State
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
          <Card className="rounded-l-none">
            <CardHeader>
              <CardTitle>{stringCapitalize(stateName)} Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {stateData.transitions.map((transition, index) => (
                  <li className="flex gap-2 items-end" key={index}>
                    <ul className="flex gap-2">
                      {objectKeys(state.states).map((state) => (
                        <li key={state}>
                          <Label className="flex-col items-start">
                            <span>{stringCapitalize(state)}</span>
                            <Select
                              onValueChange={(value) => {
                                setState.setTransitionIf(
                                  stateName,
                                  index,
                                  state,
                                  Number.parseInt(value),
                                );
                              }}
                              value={transition.if[state].toString()}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 9 }, (_, i) =>
                                  i.toString(),
                                ).map((count) => (
                                  <SelectItem key={count} value={count}>
                                    {count}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Label>
                        </li>
                      ))}
                    </ul>
                    <div className="w-full" />
                    <Label className="flex-col items-start">
                      <span>Then</span>
                      <Select
                        onValueChange={(value) => {
                          setState.setTransitionThen(stateName, index, value);
                        }}
                        value={transition.then}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {objectKeys(state.states)
                            .filter((state) => state !== stateName)
                            .map((state) => (
                              <SelectItem key={state} value={state}>
                                {stringCapitalize(state)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </Label>
                    <Button
                      onClick={() => {
                        setState.removeTransition(stateName, index);
                      }}
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <CardAction>
                <Button
                  onClick={() => {
                    setState.addTransition(stateName);
                  }}
                  variant="secondary"
                >
                  Add Transition
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        </>
      ))}
      <div className="col-span-2 flex justify-center pt-6">
        <Button className="w-md">Create</Button>
      </div>
    </section>
  );
}

function useCreateAutomaton() {
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

  return [
    state,
    {
      addState,
      addTransition,
      removeState,
      removeTransition,
      setName,
      setSlug,
      setStateColor,
      setTransitionIf,
      setTransitionThen,
    },
  ] as const;
}
