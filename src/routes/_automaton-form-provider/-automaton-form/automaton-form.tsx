import { type ChangeEvent, Fragment, useId } from "react";

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
import { State } from "@/lib/automaton";
import { stringCapitalize } from "@/lib/utils";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";
import { StateCard } from "@/routes/_automaton-form-provider/-automaton-form/state-card.tsx";
import { TransitionsCard } from "@/routes/_automaton-form-provider/-automaton-form/transitions-card.tsx";

interface AutomatonFormProps {
  readonly lockSlug?: boolean;
}

export function AutomatonForm(props: AutomatonFormProps) {
  const [state, setState] = useAutomatonFormContext();
  const nameId = useId();
  const slugId = useId();
  const baseStateId = useId();
  const addStateId = useId();

  function setName(e: ChangeEvent<HTMLInputElement>) {
    setState((prev) => prev.copyWith({ name: e.target.value }));
  }

  function setSlug(e: ChangeEvent<HTMLInputElement>) {
    setState((prev) => prev.copyWith({ slug: e.target.value }));
  }

  function setBaseState(value: string) {
    setState((prev) => prev.copyWith({ baseState: Number.parseInt(value) }));
  }

  function addState(value: string) {
    setState((prev) => prev.addState(State.blank(value)));
  }

  return (
    <section className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
      <div className="space-y-2">
        <Label htmlFor={nameId}>
          <span>Name</span>
          <Input
            autoComplete="off"
            id={nameId}
            name="name"
            onChange={setName}
            value={state.name}
          />
        </Label>
        <Label htmlFor={slugId}>
          <span>Slug</span>
          <Input
            disabled={props.lockSlug}
            id={slugId}
            name="slug"
            onChange={setSlug}
            readOnly={props.lockSlug}
            value={state.slug}
          />
        </Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor={baseStateId}>
          <span className="whitespace-nowrap">Base State</span>
          <Select
            onValueChange={setBaseState}
            value={state.baseState.toString()}
          >
            <SelectTrigger className="w-full" id={baseStateId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.states.map((state, index) => (
                <SelectItem key={state.name} value={index.toString()}>
                  {stringCapitalize(state.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
        <Label htmlFor={addStateId}>
          <span className="whitespace-nowrap">Add State</span>
          <MultiInput
            id={addStateId}
            onAdd={addState}
            value={state.states.map((state) => state.name)}
          />
        </Label>
      </div>
      {state.states.map((state, index) => (
        <Fragment key={state.name}>
          <StateCard stateIndex={index} />
          <TransitionsCard state={index} />
        </Fragment>
      ))}
    </section>
  );
}
