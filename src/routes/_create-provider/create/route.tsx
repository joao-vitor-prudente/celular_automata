import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useId } from "react";

import { useAppContext } from "@/app-context.tsx";
import { Button } from "@/components/ui/button.tsx";
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
import { builtins } from "@/lib/automata.ts";
import { objectKeys, stringCapitalize } from "@/lib/extensions";
import { StateCard } from "@/routes/_create-provider/create/-state-card.tsx";
import { TransitionsCard } from "@/routes/_create-provider/create/-transitions-card.tsx";

import { useCreateAutomatonContext } from "../-create-automaton-context.tsx";

export const Route = createFileRoute("/_create-provider/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, setState] = useCreateAutomatonContext();
  const [automata, setAutomata] = useAppContext().automata;
  const nameId = useId();
  const slugId = useId();
  const baseStateId = useId();
  const addStateId = useId();

  function saveAutomaton() {
    if (state.slug in automata) return;
    if (state.slug in builtins) return;
    setAutomata((prev) => ({ ...prev, [state.slug]: state }));
  }

  return (
    <section className="m-8 grid grid-cols-2 gap-y-6 gap-x-4">
      <div className="space-y-2">
        <Label htmlFor={nameId}>
          <span>Name</span>
          <Input
            autoComplete="off"
            id={nameId}
            name="name"
            onChange={(e) => {
              setState.setName(e.target.value);
            }}
            value={state.name}
          />
        </Label>
        <Label htmlFor={slugId}>
          <span>Slug</span>
          <Input
            id={slugId}
            name="slug"
            onChange={(e) => {
              setState.setSlug(e.target.value);
            }}
            value={state.slug}
          />
        </Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor={baseStateId}>
          <span className="whitespace-nowrap">Base State</span>
          <Select onValueChange={setState.setBaseState} value={state.baseState}>
            <SelectTrigger className="w-full" id={baseStateId}>
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
        <Label htmlFor={addStateId}>
          <span className="whitespace-nowrap">Add State</span>
          <MultiInput
            id={addStateId}
            onAdd={setState.addState}
            value={objectKeys(state.states)}
          />
        </Label>
      </div>
      {objectKeys(state.states).map((stateName) => (
        <Fragment key={stateName}>
          <StateCard stateName={stateName} />
          <TransitionsCard stateName={stateName} />
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
