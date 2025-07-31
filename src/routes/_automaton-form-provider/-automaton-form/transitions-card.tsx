import { Trash } from "lucide-react";
import { useId } from "react";

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
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { objectKeys, stringCapitalize } from "@/lib/extensions";

import { useAutomatonFormContext } from "./automaton-form-context.tsx";

interface CountSelectProps extends TransitionFormProps {
  readonly state: string;
}

interface TransitionFormProps extends TransitionsCardProps {
  readonly index: number;
  readonly transition: Automaton["states"][string]["transitions"][number];
}

interface TransitionsCardProps {
  readonly stateName: string;
}

export function TransitionsCard(props: TransitionsCardProps) {
  const [state, setState] = useAutomatonFormContext();
  return (
    <Card className="rounded-l-none">
      <CardHeader>
        <CardTitle>{stringCapitalize(props.stateName)} Transitions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {state.states[props.stateName].transitions.map(
            (transition, index) => (
              <li key={index}>
                <TransitionForm
                  index={index}
                  stateName={props.stateName}
                  transition={transition}
                />
              </li>
            ),
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button
            onClick={() => {
              setState.addTransition(props.stateName);
            }}
            variant="secondary"
          >
            Add Transition
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}

function CountSelect(props: CountSelectProps) {
  const [_, setState] = useAutomatonFormContext();
  const countId = useId();
  return (
    <Label className="flex-col items-start" htmlFor={countId}>
      <span>{stringCapitalize(props.state)}</span>
      <Select
        onValueChange={(value) => {
          setState.setTransitionIf(
            props.stateName,
            props.index,
            props.state,
            Number.parseInt(value),
          );
        }}
        value={props.transition.if[props.state].toString()}
      >
        <SelectTrigger id={countId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 9 }, (_, i) => i.toString()).map((count) => (
            <SelectItem key={count} value={count}>
              {count}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
}

function TransitionForm(props: TransitionFormProps) {
  const [state, setState] = useAutomatonFormContext();
  const thenId = useId();
  return (
    <div className="flex gap-2 items-end">
      <ul className="flex gap-2">
        {objectKeys(state.states).map((s) => (
          <li key={s}>
            <CountSelect {...props} state={s} />
          </li>
        ))}
      </ul>
      <div className="w-full" />
      <Label className="flex-col items-start" htmlFor={thenId}>
        <span>Then</span>
        <Select
          onValueChange={(value) => {
            setState.setTransitionThen(props.stateName, props.index, value);
          }}
          value={props.transition.then}
        >
          <SelectTrigger id={thenId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {objectKeys(state.states)
              .filter((state) => state !== props.stateName)
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
          setState.removeTransition(props.stateName, props.index);
        }}
        variant="destructive"
      >
        <Trash />
      </Button>
    </div>
  );
}
