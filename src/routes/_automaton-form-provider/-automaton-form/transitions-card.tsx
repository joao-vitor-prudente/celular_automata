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
import { stringCapitalize } from "@/lib/extensions";

import { useAutomatonFormContext } from "./automaton-form-context.tsx";

interface CountSelectProps extends TransitionFormProps {
  readonly currentStateIndex: number;
}

interface TransitionFormProps extends TransitionsCardProps {
  readonly index: number;
  readonly transition: Automaton["states"][number]["transitions"][number];
}

interface TransitionsCardProps {
  readonly stateIndex: number;
}

export function TransitionsCard(props: TransitionsCardProps) {
  const [state, setState] = useAutomatonFormContext();
  return (
    <Card className="rounded-l-none">
      <CardHeader>
        <CardTitle>
          {stringCapitalize(state.states[props.stateIndex].name)} Transitions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {state.states[props.stateIndex].transitions.map(
            (transition, index) => (
              <li key={index}>
                <TransitionForm
                  index={index}
                  stateIndex={props.stateIndex}
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
              setState.addTransition(props.stateIndex);
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
  const [state, setState] = useAutomatonFormContext();
  const countId = useId();
  return (
    <Label className="flex-col items-start" htmlFor={countId}>
      <span>
        {stringCapitalize(state.states[props.currentStateIndex].name)}
      </span>
      <Select
        onValueChange={(value) => {
          setState.setTransitionIf(
            props.stateIndex,
            props.index,
            props.currentStateIndex,
            Number.parseInt(value),
          );
        }}
        value={props.transition.if[props.currentStateIndex].toString()}
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
    <div className="flex items-end gap-2">
      <ul className="flex gap-2">
        {state.states.map((s, index) => (
          <li key={s.name}>
            <CountSelect {...props} currentStateIndex={index} />
          </li>
        ))}
      </ul>
      <div className="w-full" />
      <Label className="flex-col items-start" htmlFor={thenId}>
        <span>Then</span>
        <Select
          onValueChange={(value) => {
            setState.setTransitionThen(
              props.stateIndex,
              props.index,
              Number.parseInt(value),
            );
          }}
          value={props.transition.then.toString()}
        >
          <SelectTrigger id={thenId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {state.states.map((s, index) => (
              <SelectItem
                disabled={index === props.stateIndex}
                key={s.name}
                value={index.toString()}
              >
                {stringCapitalize(s.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <Button
        onClick={() => {
          setState.removeTransition(props.stateIndex, props.index);
        }}
        variant="destructive"
      >
        <Trash />
      </Button>
    </div>
  );
}
