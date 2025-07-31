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
import { objectKeys, stringCapitalize } from "@/lib/extensions";
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
    </section>
  );
}
