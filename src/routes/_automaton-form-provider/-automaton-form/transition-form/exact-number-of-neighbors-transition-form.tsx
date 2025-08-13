import { Trash } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { ExactNumberOfNeighborsTransition } from "@/lib/automaton/transitions";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";

interface CountSelectProps extends TransitionFormProps {
  readonly ifState: number;
}

interface TransitionFormProps {
  readonly state: number;
  readonly transition: ExactNumberOfNeighborsTransition;
  readonly transitionIndex: number;
}

export function ExactNumberOfNeighborsTransitionForm(
  props: TransitionFormProps,
) {
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
      <ul className="flex gap-2">
        {state.states.map((s, index) => (
          <li key={s.name}>
            <CountSelect {...props} ifState={index} />
          </li>
        ))}
      </ul>
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

function CountSelect(props: CountSelectProps) {
  const [state, setState] = useAutomatonFormContext();
  const countId = useId();

  function setTransitionIf(value: string) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.setIf(props.ifState, Number.parseInt(value)),
      );
      return prev.setState(props.state, newState);
    });
  }

  return (
    <Label className="flex-col items-start" htmlFor={countId}>
      <span>{stringCapitalize(state.states[props.ifState].name)}</span>
      <Select
        onValueChange={setTransitionIf}
        value={props.transition.if_[props.ifState].toString()}
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
