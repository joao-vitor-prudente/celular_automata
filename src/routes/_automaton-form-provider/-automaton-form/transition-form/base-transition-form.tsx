import { Trash } from "lucide-react";
import { type PropsWithChildren, useId } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { type Transition } from "@/lib/automaton/transitions";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";

export interface TransitionFormProps<T extends Transition = Transition>
  extends PropsWithChildren {
  readonly state: number;
  readonly transition: T;
  readonly transitionIndex: number;
}

export function BaseTransitionForm(props: TransitionFormProps) {
  const [state, setState] = useAutomatonFormContext();
  const thenId = useId();

  function setTransitionThen(value: string) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.copyWith({ then: Number.parseInt(value) }),
      );
      return prev.setState(props.state, newState);
    });
  }

  function removeTransition() {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.removeTransition(props.transitionIndex);
      return prev.setState(props.state, newState);
    });
  }

  return (
    <div className="flex items-end gap-2">
      {props.children}
      <div className="w-full" />
      <Label className="flex-col items-start" htmlFor={thenId}>
        <span>Then</span>
        <Select
          onValueChange={setTransitionThen}
          value={props.transition.then.toString()}
        >
          <SelectTrigger id={thenId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {state.states.map((s, index) => (
              <SelectItem
                disabled={index === props.state}
                key={s.name}
                value={index.toString()}
              >
                {stringCapitalize(s.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <Button onClick={removeTransition} variant="destructive">
        <Trash />
      </Button>
    </div>
  );
}
