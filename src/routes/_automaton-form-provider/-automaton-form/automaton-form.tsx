import { Fragment, useId } from "react";

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
import { stringCapitalize } from "@/lib/extensions";
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

  return (
    <section className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
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
            disabled={props.lockSlug}
            id={slugId}
            name="slug"
            onChange={(e) => {
              setState.setSlug(e.target.value);
            }}
            readOnly={props.lockSlug}
            value={state.slug}
          />
        </Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor={baseStateId}>
          <span className="whitespace-nowrap">Base State</span>
          <Select
            onValueChange={(value) => {
              setState.setBaseState(Number.parseInt(value));
            }}
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
            onAdd={setState.addState}
            value={state.states.map((state) => state.name)}
          />
        </Label>
      </div>
      {state.states.map((state, index) => (
        <Fragment key={state.name}>
          <StateCard stateIndex={index} />
          <TransitionsCard stateIndex={index} />
        </Fragment>
      ))}
    </section>
  );
}
