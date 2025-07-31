import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { Fragment } from "react";

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
import { useAutomataContext } from "@/contexts/automata-context.tsx";
import { useCreateAutomaton } from "@/hooks/use-create-automaton.ts";
import { builtins } from "@/lib/automata.ts";
import { objectEntries, objectKeys, stringCapitalize } from "@/lib/extensions";

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, setState] = useCreateAutomaton();
  const [automata, setAutomata] = useAutomataContext();

  function saveAutomaton() {
    if (state.slug in automata) return;
    if (state.slug in builtins) return;
    setAutomata((prev) => ({ ...prev, [state.slug]: state }));
  }

  return (
    <section className="m-8 grid grid-cols-2 gap-y-6 gap-x-4">
      <div className="space-y-2">
        <Label htmlFor="name-input">
          <span>Name</span>
          <Input
            autoComplete="off"
            id="name-input"
            name="name"
            onChange={(e) => {
              setState.setName(e.target.value);
            }}
            value={state.name}
          />
        </Label>
        <Label htmlFor="slug-input">
          <span>Slug</span>
          <Input
            id="slug-input"
            name="slug"
            onChange={(e) => {
              setState.setSlug(e.target.value);
            }}
            value={state.slug}
          />
        </Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="base-state-select">
          <span className="whitespace-nowrap">Base State</span>
          <Select onValueChange={setState.setBaseState} value={state.baseState}>
            <SelectTrigger className="w-full" id="base-state-select">
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
        <Label htmlFor="add-state-multi-input">
          <span className="whitespace-nowrap">Add State</span>
          <MultiInput
            id="add-state-multi-input"
            onAdd={setState.addState}
            value={objectKeys(state.states)}
          />
        </Label>
      </div>
      {objectEntries(state.states).map(([stateName, stateData]) => (
        <Fragment key={stateName}>
          <Card className="rounded-r-none">
            <CardHeader>
              <CardTitle>{stringCapitalize(stateName)} State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor={`${stateName}-color-input`}>
                <span>Color</span>
                <Input
                  id={`${stateName}-color-input`}
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
              <ul className="space-y-4">
                {stateData.transitions.map((transition, index) => (
                  <li className="flex gap-2 items-end" key={index}>
                    <ul className="flex gap-2">
                      {objectKeys(state.states).map((state) => (
                        <li key={state}>
                          <Label
                            className="flex-col items-start"
                            htmlFor={`${stateName}-${index.toString()}-${state}-select`}
                          >
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
                              <SelectTrigger
                                id={`${stateName}-${index.toString()}-${state}-select`}
                              >
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
                    <Label
                      className="flex-col items-start"
                      htmlFor={`${stateName}-${index.toString()}-then-select`}
                    >
                      <span>Then</span>
                      <Select
                        onValueChange={(value) => {
                          setState.setTransitionThen(stateName, index, value);
                        }}
                        value={transition.then}
                      >
                        <SelectTrigger
                          id={`${stateName}-${index.toString()}-then-select`}
                        >
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
        </Fragment>
      ))}
      <div className="col-span-2 flex justify-center pt-6">
        <Button className="w-md" onClick={saveAutomaton}>
          Create
        </Button>
      </div>
    </section>
  );
}
